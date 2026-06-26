<?php
/**
 * Plugin Name: エンジン 会員・応募・お問い合わせ
 * Description: エンジン（エンタメ人材キャリアマッチング）の会員登録・ログイン・求人応募・お問い合わせ機能。応募(application)・問い合わせ(inquiry)を保存し、管理ダッシュボードと会員一覧を提供する。
 * Version: 1.0.0
 * Author: 株式会社フォーミュレーションI.T.S.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ============================================================
   会員ロール（member）の登録・維持
   ============================================================ */
function engine_register_member_role() {
    if (!get_role('member')) {
        add_role('member', '会員', array('read' => true));
    }
}
register_activation_hook(__FILE__, 'engine_register_member_role');
add_action('init', 'engine_register_member_role');

/* ============================================================
   カスタム投稿タイプ：応募 / お問い合わせ
   ============================================================ */
function engine_members_register_cpt() {
    register_post_type('application', array(
        'labels' => array(
            'name'          => '応募',
            'singular_name' => '応募',
            'all_items'     => '応募一覧',
            'menu_name'     => '応募',
            'edit_item'     => '応募の詳細',
        ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => 'engine-admin',
        'capability_type'     => 'post',
        'map_meta_cap'        => true,
        'supports'            => array('title'),
        'exclude_from_search' => true,
    ));

    register_post_type('inquiry', array(
        'labels' => array(
            'name'          => 'お問い合わせ',
            'singular_name' => 'お問い合わせ',
            'all_items'     => 'お問い合わせ一覧',
            'menu_name'     => 'お問い合わせ',
            'edit_item'     => 'お問い合わせの詳細',
        ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => 'engine-admin',
        'capability_type'     => 'post',
        'map_meta_cap'        => true,
        'supports'            => array('title'),
        'exclude_from_search' => true,
    ));
}
add_action('init', 'engine_members_register_cpt');

/* ============================================================
   会員登録
   ============================================================ */
function engine_handle_signup() {
    $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $email = strtolower(trim($email));
    $password = isset($_POST['password']) ? (string) wp_unslash($_POST['password']) : '';
    $name = isset($_POST['contact_name']) ? sanitize_text_field(wp_unslash($_POST['contact_name'])) : '';

    if (!is_email($email) || $name === '') {
        wp_safe_redirect(add_query_arg('error', 'invalid', home_url('/signup')));
        exit;
    }
    if (strlen($password) < 6) {
        wp_safe_redirect(add_query_arg('error', 'password', home_url('/signup')));
        exit;
    }
    if (email_exists($email) || username_exists($email)) {
        wp_safe_redirect(add_query_arg('error', 'email_exists', home_url('/signup')));
        exit;
    }

    $user_id = wp_insert_user(array(
        'user_login'   => $email,
        'user_email'   => $email,
        'user_pass'    => $password,
        'display_name' => $name,
        'first_name'   => $name,
        'role'         => get_role('member') ? 'member' : 'subscriber',
    ));
    if (is_wp_error($user_id)) {
        wp_safe_redirect(add_query_arg('error', 'invalid', home_url('/signup')));
        exit;
    }

    update_user_meta($user_id, 'contact_name', $name);
    update_user_meta($user_id, 'birthdate', isset($_POST['birthdate']) ? sanitize_text_field(wp_unslash($_POST['birthdate'])) : '');
    update_user_meta($user_id, 'phone', isset($_POST['phone']) ? sanitize_text_field(wp_unslash($_POST['phone'])) : '');
    update_user_meta($user_id, 'user_type', isset($_POST['user_type']) ? sanitize_text_field(wp_unslash($_POST['user_type'])) : '');

    $cats = isset($_POST['interested_categories']) && is_array($_POST['interested_categories'])
        ? array_map('sanitize_text_field', wp_unslash($_POST['interested_categories']))
        : array();
    update_user_meta($user_id, 'interested_categories', $cats);
    update_user_meta($user_id, 'newsletter_opt_in', isset($_POST['newsletter_opt_in']) ? '1' : '0');

    // 登録した情報でそのままログイン
    wp_signon(array(
        'user_login'    => $email,
        'user_password' => $password,
        'remember'      => true,
    ), is_ssl());
    wp_set_current_user($user_id);

    wp_safe_redirect(home_url('/mypage'));
    exit;
}
add_action('admin_post_nopriv_engine_signup', 'engine_handle_signup');
add_action('admin_post_engine_signup', 'engine_handle_signup');

/* ============================================================
   ログイン
   ============================================================ */
function engine_handle_login() {
    $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $email = strtolower(trim($email));
    $password = isset($_POST['password']) ? (string) wp_unslash($_POST['password']) : '';

    if (!is_email($email) || $password === '') {
        wp_safe_redirect(add_query_arg('error', 'login_failed', home_url('/login')));
        exit;
    }

    $user = get_user_by('email', $email);
    if (!$user) {
        wp_safe_redirect(add_query_arg('error', 'login_failed', home_url('/login')));
        exit;
    }

    $signed = wp_signon(array(
        'user_login'    => $user->user_login,
        'user_password' => $password,
        'remember'      => true,
    ), is_ssl());

    if (is_wp_error($signed)) {
        wp_safe_redirect(add_query_arg('error', 'login_failed', home_url('/login')));
        exit;
    }

    wp_set_current_user($signed->ID);
    wp_safe_redirect(home_url('/jobs'));
    exit;
}
add_action('admin_post_nopriv_engine_login', 'engine_handle_login');
add_action('admin_post_engine_login', 'engine_handle_login');

/* ============================================================
   求人への応募
   ============================================================ */
function engine_handle_apply() {
    if (!is_user_logged_in()) {
        wp_safe_redirect(home_url('/login'));
        exit;
    }
    if (!isset($_POST['engine_apply_nonce']) || !wp_verify_nonce($_POST['engine_apply_nonce'], 'engine_apply')) {
        wp_safe_redirect(home_url('/jobs'));
        exit;
    }

    $job_id = isset($_POST['job_id']) ? (int) $_POST['job_id'] : 0;
    $job = get_post($job_id);
    if (!$job || $job->post_type !== 'job') {
        wp_safe_redirect(home_url('/jobs'));
        exit;
    }

    $current_user = wp_get_current_user();
    $name    = isset($_POST['applicant_name']) ? sanitize_text_field(wp_unslash($_POST['applicant_name'])) : '';
    $age     = isset($_POST['age']) ? sanitize_text_field(wp_unslash($_POST['age'])) : '';
    $address = isset($_POST['address']) ? sanitize_text_field(wp_unslash($_POST['address'])) : '';
    $phone   = isset($_POST['phone']) ? sanitize_text_field(wp_unslash($_POST['phone'])) : '';
    $gender  = isset($_POST['gender']) ? sanitize_text_field(wp_unslash($_POST['gender'])) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';

    // フォームで入力されたメールを優先。未入力・不正なら登録メールを使う。
    $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    if (!is_email($email)) {
        $email = $current_user->user_email;
    }

    if ($name === '' || $age === '' || $address === '' || $phone === '' || $gender === '') {
        wp_safe_redirect(add_query_arg('apply_error', '1', get_permalink($job_id)));
        exit;
    }

    $app_id = wp_insert_post(array(
        'post_type'   => 'application',
        'post_status' => 'publish',
        'post_title'  => $name . '｜' . get_the_title($job_id),
    ));
    if (is_wp_error($app_id) || !$app_id) {
        wp_safe_redirect(add_query_arg('apply_error', '1', get_permalink($job_id)));
        exit;
    }

    update_post_meta($app_id, 'job_id', $job_id);
    update_post_meta($app_id, 'job_title', get_the_title($job_id));
    update_post_meta($app_id, 'user_id', $current_user->ID);
    update_post_meta($app_id, 'applicant_name', $name);
    update_post_meta($app_id, 'email', $email);
    update_post_meta($app_id, 'age', $age);
    update_post_meta($app_id, 'gender', $gender);
    update_post_meta($app_id, 'address', $address);
    update_post_meta($app_id, 'phone', $phone);
    update_post_meta($app_id, 'message', $message);
    update_post_meta($app_id, 'status', '未対応');

    // 管理者へ通知
    $admin_email = get_option('admin_email');
    $subject = '【エンジン】新しい応募がありました：' . get_the_title($job_id);
    $body  = "新しい応募がありました。\n\n";
    $body .= "■求人：" . get_the_title($job_id) . "\n";
    $body .= "■氏名：" . $name . "\n";
    $body .= "■メール：" . $email . "\n";
    $body .= "■年齢：" . $age . "\n";
    $body .= "■性別：" . $gender . "\n";
    $body .= "■住所：" . $address . "\n";
    $body .= "■電話：" . $phone . "\n";
    $body .= "■メッセージ：\n" . $message . "\n\n";
    $body .= "管理画面：" . admin_url('post.php?post=' . $app_id . '&action=edit') . "\n";
    wp_mail($admin_email, $subject, $body);

    wp_safe_redirect(add_query_arg('applied', '1', get_permalink($job_id)));
    exit;
}
add_action('admin_post_engine_apply', 'engine_handle_apply');
add_action('admin_post_nopriv_engine_apply', 'engine_handle_apply');

/* ============================================================
   お問い合わせ
   ============================================================ */
function engine_handle_contact() {
    if (!isset($_POST['engine_contact_nonce']) || !wp_verify_nonce($_POST['engine_contact_nonce'], 'engine_contact')) {
        wp_safe_redirect(add_query_arg('error', 'invalid', home_url('/contact')));
        exit;
    }

    $name    = isset($_POST['contact_name']) ? sanitize_text_field(wp_unslash($_POST['contact_name'])) : '';
    $email   = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $phone   = isset($_POST['phone']) ? sanitize_text_field(wp_unslash($_POST['phone'])) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';

    if ($name === '' || !is_email($email) || $message === '') {
        wp_safe_redirect(add_query_arg('error', 'invalid', home_url('/contact')));
        exit;
    }

    $iq_id = wp_insert_post(array(
        'post_type'   => 'inquiry',
        'post_status' => 'publish',
        'post_title'  => $name . '｜' . mb_substr($message, 0, 20),
    ));
    if (!is_wp_error($iq_id) && $iq_id) {
        update_post_meta($iq_id, 'contact_name', $name);
        update_post_meta($iq_id, 'email', $email);
        update_post_meta($iq_id, 'phone', $phone);
        update_post_meta($iq_id, 'message', $message);
        update_post_meta($iq_id, 'status', '未対応');

        $admin_email = get_option('admin_email');
        $subject = '【エンジン】新しいお問い合わせがありました';
        $body  = "お名前：" . $name . "\n";
        $body .= "メール：" . $email . "\n";
        $body .= "電話：" . $phone . "\n\n";
        $body .= "内容：\n" . $message . "\n\n";
        $body .= "管理画面：" . admin_url('post.php?post=' . $iq_id . '&action=edit') . "\n";
        wp_mail($admin_email, $subject, $body);
    }

    wp_safe_redirect(add_query_arg('sent', '1', home_url('/contact')));
    exit;
}
add_action('admin_post_engine_contact', 'engine_handle_contact');
add_action('admin_post_nopriv_engine_contact', 'engine_handle_contact');

/* ============================================================
   応募・お問い合わせ メタボックス（管理画面で内容を表示）
   ============================================================ */
function engine_members_meta_boxes() {
    add_meta_box('engine_application_detail', '応募内容', 'engine_render_application_box', 'application', 'normal', 'high');
    add_meta_box('engine_inquiry_detail', 'お問い合わせ内容', 'engine_render_inquiry_box', 'inquiry', 'normal', 'high');
}
add_action('add_meta_boxes', 'engine_members_meta_boxes');

function engine_kv_row($label, $value) {
    echo '<tr><th style="text-align:left;padding:6px 12px;width:140px;vertical-align:top;color:#555;">' . esc_html($label) . '</th>';
    echo '<td style="padding:6px 12px;">' . nl2br(esc_html($value)) . '</td></tr>';
}

function engine_render_application_box($post) {
    $id = $post->ID;
    $g = function ($k) use ($id) { return (string) get_post_meta($id, $k, true); };
    echo '<table style="width:100%;border-collapse:collapse;">';
    engine_kv_row('応募求人', $g('job_title'));
    engine_kv_row('氏名', $g('applicant_name'));
    engine_kv_row('メール', $g('email'));
    engine_kv_row('年齢', $g('age'));
    engine_kv_row('性別', $g('gender'));
    engine_kv_row('住所', $g('address'));
    engine_kv_row('電話番号', $g('phone'));
    engine_kv_row('メッセージ', $g('message'));
    echo '</table>';

    $status = $g('status') ?: '未対応';
    wp_nonce_field('engine_app_status', 'engine_app_status_nonce');
    echo '<p style="margin-top:12px;"><label style="font-weight:600;">ステータス：</label> <select name="engine_app_status">';
    foreach (array('未対応', '選考中', '完了', '見送り') as $st) {
        echo '<option value="' . esc_attr($st) . '"' . selected($status, $st, false) . '>' . esc_html($st) . '</option>';
    }
    echo '</select>（更新して保存）</p>';
}

function engine_render_inquiry_box($post) {
    $id = $post->ID;
    $g = function ($k) use ($id) { return (string) get_post_meta($id, $k, true); };
    echo '<table style="width:100%;border-collapse:collapse;">';
    engine_kv_row('お名前', $g('contact_name'));
    engine_kv_row('メール', $g('email'));
    engine_kv_row('電話番号', $g('phone'));
    engine_kv_row('内容', $g('message'));
    echo '</table>';
}

function engine_save_application_status($post_id) {
    if (!isset($_POST['engine_app_status_nonce']) || !wp_verify_nonce($_POST['engine_app_status_nonce'], 'engine_app_status')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    if (isset($_POST['engine_app_status'])) {
        update_post_meta($post_id, 'status', sanitize_text_field(wp_unslash($_POST['engine_app_status'])));
    }
}
add_action('save_post_application', 'engine_save_application_status');

/* ============================================================
   管理メニュー：エンジン管理（ダッシュボード／会員）
   ============================================================ */
function engine_admin_menu() {
    add_menu_page('エンジン管理', 'エンジン管理', 'edit_posts', 'engine-admin', 'engine_admin_dashboard_page', 'dashicons-superhero', 3);
    add_submenu_page('engine-admin', 'ダッシュボード', 'ダッシュボード', 'edit_posts', 'engine-admin', 'engine_admin_dashboard_page');
    add_submenu_page('engine-admin', '会員（顧客情報）', '会員（顧客情報）', 'list_users', 'engine-members', 'engine_admin_members_page');
    add_submenu_page('engine-admin', 'お問い合わせ送信先', 'お問い合わせ送信先', 'manage_options', 'engine-contact-recipients', 'engine_admin_recipients_page');
}
add_action('admin_menu', 'engine_admin_menu');

/* ============================================================
   お問い合わせ送信先（受信メール）の管理 ＋ CF7 宛先への反映
   ============================================================ */

/** 設定された送信先メールの配列を返す（既定: kankan6123@gmail.com） */
function engine_get_contact_recipients() {
    $r = get_option('engine_contact_recipients');
    if (!is_array($r) || empty($r)) {
        $r = array('kankan6123@gmail.com');
    }
    return array_values(array_filter(array_unique($r)));
}

/** Contact Form 7 の宛先を、設定された送信先で上書き */
function engine_cf7_set_recipients($components, $contact_form = null) {
    $recipients = engine_get_contact_recipients();
    if (!empty($recipients)) {
        $components['recipient'] = implode(', ', $recipients);
    }
    return $components;
}
add_filter('wpcf7_mail_components', 'engine_cf7_set_recipients', 20, 2);

/** CF7 送信内容を inquiry（お問い合わせ）として保存。管理画面で送信者の閲覧・削除が可能になる。 */
function engine_cf7_store_inquiry($contact_form) {
    if (!class_exists('WPCF7_Submission')) {
        return;
    }
    $submission = WPCF7_Submission::get_instance();
    if (!$submission) {
        return;
    }
    $data = $submission->get_posted_data();
    $name    = isset($data['your-name']) ? sanitize_text_field((string) $data['your-name']) : '';
    $email   = isset($data['your-email']) ? sanitize_email((string) $data['your-email']) : '';
    $phone   = isset($data['your-tel']) ? sanitize_text_field((string) $data['your-tel']) : '';
    $message = isset($data['your-message']) ? sanitize_textarea_field((string) $data['your-message']) : '';

    if ($name === '' && $email === '' && $message === '') {
        return;
    }

    $iq_id = wp_insert_post(array(
        'post_type'   => 'inquiry',
        'post_status' => 'publish',
        'post_title'  => ($name !== '' ? $name : ($email !== '' ? $email : '匿名')) . '｜' . mb_substr($message, 0, 20),
    ));
    if (!is_wp_error($iq_id) && $iq_id) {
        update_post_meta($iq_id, 'contact_name', $name);
        update_post_meta($iq_id, 'email', $email);
        update_post_meta($iq_id, 'phone', $phone);
        update_post_meta($iq_id, 'message', $message);
        update_post_meta($iq_id, 'status', '未対応');
        update_post_meta($iq_id, 'source', 'mypage-cf7');
        $u = wp_get_current_user();
        if ($u && $u->ID) {
            update_post_meta($iq_id, 'user_id', $u->ID);
        }
    }
}
add_action('wpcf7_before_send_mail', 'engine_cf7_store_inquiry', 10, 1);

/** 送信先の追加・削除画面 */
function engine_admin_recipients_page() {
    if (!current_user_can('manage_options')) {
        wp_die('権限がありません。');
    }
    $notice = '';

    // 追加
    if (isset($_POST['engine_add_recipient']) && check_admin_referer('engine_recipients')) {
        $email = isset($_POST['recipient_email']) ? sanitize_email(wp_unslash($_POST['recipient_email'])) : '';
        if (is_email($email)) {
            $list = engine_get_contact_recipients();
            if (!in_array($email, $list, true)) {
                $list[] = $email;
                update_option('engine_contact_recipients', array_values($list));
                $notice = '送信先を追加しました：' . $email;
            } else {
                $notice = 'すでに登録されています：' . $email;
            }
        } else {
            $notice = '有効なメールアドレスを入力してください。';
        }
    }

    // 削除
    if (isset($_POST['engine_delete_recipient']) && check_admin_referer('engine_recipients')) {
        $email = isset($_POST['recipient_email']) ? sanitize_email(wp_unslash($_POST['recipient_email'])) : '';
        $list = engine_get_contact_recipients();
        $list = array_values(array_filter($list, function ($e) use ($email) {
            return $e !== $email;
        }));
        if (empty($list)) {
            // 最低1件は残す（既定に戻す）
            $list = array('kankan6123@gmail.com');
            $notice = '送信先が空になるため、既定（kankan6123@gmail.com）に戻しました。';
        } else {
            $notice = '送信先を削除しました：' . $email;
        }
        update_option('engine_contact_recipients', $list);
    }

    $recipients = engine_get_contact_recipients();
    ?>
    <div class="wrap">
        <h1>お問い合わせ送信先（受信メール）</h1>
        <p>マイページのお問い合わせ（Contact Form 7）が送信されたとき、ここに登録したメールアドレス宛に通知されます。複数登録できます。</p>
        <?php if ($notice) : ?>
            <div class="notice notice-info is-dismissible"><p><?php echo esc_html($notice); ?></p></div>
        <?php endif; ?>

        <h2>現在の送信先</h2>
        <table class="widefat striped" style="max-width:640px;">
            <thead><tr><th>メールアドレス</th><th style="width:120px;">操作</th></tr></thead>
            <tbody>
                <?php foreach ($recipients as $email) : ?>
                    <tr>
                        <td><?php echo esc_html($email); ?></td>
                        <td>
                            <form method="post" style="margin:0;" onsubmit="return confirm('「<?php echo esc_js($email); ?>」を削除しますか？');">
                                <?php wp_nonce_field('engine_recipients'); ?>
                                <input type="hidden" name="recipient_email" value="<?php echo esc_attr($email); ?>" />
                                <button type="submit" name="engine_delete_recipient" class="button button-link-delete">削除</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <h2 style="margin-top:24px;">送信先を追加</h2>
        <form method="post" style="max-width:640px;">
            <?php wp_nonce_field('engine_recipients'); ?>
            <input type="email" name="recipient_email" class="regular-text" placeholder="例: staff@example.com" required />
            <button type="submit" name="engine_add_recipient" class="button button-primary">追加</button>
        </form>

        <p style="color:#666;margin-top:18px;">※ ここでの設定はマイページのお問い合わせフォーム（CF7）の宛先に自動反映されます（フォームの再設定は不要です）。</p>
    </div>
    <?php
}

function engine_admin_dashboard_page() {
    $job_count = wp_count_posts('job');
    $app_count = wp_count_posts('application');
    $iq_count  = wp_count_posts('inquiry');
    $member_count = count_users();
    ?>
    <div class="wrap">
        <h1>エンジン 管理ダッシュボード</h1>
        <div style="display:flex;flex-wrap:wrap;gap:16px;margin:20px 0;">
            <div style="flex:1;min-width:160px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;">
                <div style="font-size:13px;color:#666;">公開中の求人</div>
                <div style="font-size:28px;font-weight:700;"><?php echo esc_html($job_count->publish ?? 0); ?> 件</div>
            </div>
            <div style="flex:1;min-width:160px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;">
                <div style="font-size:13px;color:#666;">応募</div>
                <div style="font-size:28px;font-weight:700;"><?php echo esc_html($app_count->publish ?? 0); ?> 件</div>
            </div>
            <div style="flex:1;min-width:160px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;">
                <div style="font-size:13px;color:#666;">お問い合わせ</div>
                <div style="font-size:28px;font-weight:700;"><?php echo esc_html($iq_count->publish ?? 0); ?> 件</div>
            </div>
            <div style="flex:1;min-width:160px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;">
                <div style="font-size:13px;color:#666;">会員数</div>
                <div style="font-size:28px;font-weight:700;"><?php echo esc_html($member_count['total_users']); ?> 名</div>
            </div>
        </div>

        <h2>クイックリンク</h2>
        <p>
            <a href="<?php echo esc_url(admin_url('post-new.php?post_type=job')); ?>" class="button button-primary">新規求人を追加</a>
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=job')); ?>" class="button">求人一覧</a>
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=application')); ?>" class="button">応募一覧</a>
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=inquiry')); ?>" class="button">お問い合わせ一覧</a>
            <a href="<?php echo esc_url(admin_url('admin.php?page=engine-members')); ?>" class="button">会員一覧</a>
        </p>

        <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px 20px;margin-top:24px;max-width:860px;">
            <h2 style="margin-top:0;">「おすすめ求人」の表示ロジックについて</h2>
            <p>マイページや求人一覧に表示される「おすすめ求人」は、次のルールで自動的に選ばれます。</p>
            <ol style="line-height:1.9;">
                <li><strong>マッチング基準：</strong>会員が登録時に選んだ「興味のある職種（interested_categories）」と、求人の「職種（category）」が一致する公開中の求人を抽出します。</li>
                <li><strong>並び順：</strong>新着順（投稿日が新しい順）に並べます。</li>
                <li><strong>表示件数：</strong>マイページは最大6件、求人一覧ページは最大3件まで表示します。</li>
                <li><strong>該当なしのとき：</strong>会員が職種を未選択、または一致する求人がない場合、マイページでは代わりに「新着の求人」を表示します。</li>
            </ol>
            <p style="color:#666;">※ 公開（is_active）になっていない求人はおすすめに含まれません。会員へより良いおすすめを出すには、求人の「職種」を正しく設定してください。</p>
        </div>

        <?php
        $recent_apps = get_posts(array('post_type' => 'application', 'posts_per_page' => 5, 'post_status' => 'publish'));
        if ($recent_apps) :
        ?>
        <h2 style="margin-top:24px;">最近の応募</h2>
        <table class="widefat striped" style="max-width:860px;">
            <thead><tr><th>氏名</th><th>求人</th><th>ステータス</th><th>日時</th><th></th></tr></thead>
            <tbody>
                <?php foreach ($recent_apps as $a) : ?>
                    <tr>
                        <td><?php echo esc_html(get_post_meta($a->ID, 'applicant_name', true)); ?></td>
                        <td><?php echo esc_html(get_post_meta($a->ID, 'job_title', true)); ?></td>
                        <td><?php echo esc_html(get_post_meta($a->ID, 'status', true) ?: '未対応'); ?></td>
                        <td><?php echo esc_html(get_the_date('Y/m/d H:i', $a)); ?></td>
                        <td><a href="<?php echo esc_url(get_edit_post_link($a->ID)); ?>">詳細</a></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </div>
    <?php
}

function engine_admin_members_page() {
    if (!current_user_can('list_users')) {
        wp_die('権限がありません。');
    }
    $paged = isset($_GET['paged']) ? max(1, (int) $_GET['paged']) : 1;
    $per_page = 20;
    $query = new WP_User_Query(array(
        'number'  => $per_page,
        'paged'   => $paged,
        'orderby' => 'registered',
        'order'   => 'DESC',
    ));
    $users = $query->get_results();
    $total = $query->get_total();
    $total_pages = (int) ceil($total / $per_page);
    ?>
    <div class="wrap">
        <h1>会員（顧客情報）</h1>
        <p>登録会員の一覧です。応募やお問い合わせの詳細は各CPTの一覧からご確認ください。</p>
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>氏名</th><th>メール</th><th>電話番号</th><th>区分</th><th>生年月日</th><th>興味のある職種</th><th>お知らせ</th><th>登録日</th><th></th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)) : ?>
                    <tr><td colspan="9">会員がいません。</td></tr>
                <?php else : foreach ($users as $u) :
                    $cats = get_user_meta($u->ID, 'interested_categories', true);
                    $cats = is_array($cats) ? implode('、', array_filter($cats)) : '';
                    $nl = get_user_meta($u->ID, 'newsletter_opt_in', true);
                ?>
                    <tr>
                        <td><?php echo esc_html(get_user_meta($u->ID, 'contact_name', true) ?: $u->display_name); ?></td>
                        <td><?php echo esc_html($u->user_email); ?></td>
                        <td><?php echo esc_html(get_user_meta($u->ID, 'phone', true)); ?></td>
                        <td><?php echo esc_html(get_user_meta($u->ID, 'user_type', true)); ?></td>
                        <td><?php echo esc_html(get_user_meta($u->ID, 'birthdate', true)); ?></td>
                        <td><?php echo esc_html($cats); ?></td>
                        <td><?php echo $nl === '1' ? '受け取る' : '不要'; ?></td>
                        <td><?php echo esc_html(mysql2date('Y/m/d', $u->user_registered)); ?></td>
                        <td><a href="<?php echo esc_url(get_edit_user_link($u->ID)); ?>">編集</a></td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
        <?php if ($total_pages > 1) : ?>
            <div class="tablenav"><div class="tablenav-pages">
                <?php
                echo paginate_links(array(
                    'base'    => add_query_arg('paged', '%#%'),
                    'format'  => '',
                    'current' => $paged,
                    'total'   => $total_pages,
                ));
                ?>
            </div></div>
        <?php endif; ?>
    </div>
    <?php
}

/* ============================================================
   ユーザー一覧に列を追加・プロフィール項目の表示/保存
   ============================================================ */
function engine_member_user_columns($columns) {
    $columns['engine_phone'] = '電話番号';
    $columns['engine_type']  = '区分';
    return $columns;
}
add_filter('manage_users_columns', 'engine_member_user_columns');

function engine_member_user_column_content($output, $column_name, $user_id) {
    if ($column_name === 'engine_phone') {
        return esc_html(get_user_meta($user_id, 'phone', true));
    }
    if ($column_name === 'engine_type') {
        return esc_html(get_user_meta($user_id, 'user_type', true));
    }
    return $output;
}
add_filter('manage_users_custom_column', 'engine_member_user_column_content', 10, 3);

function engine_member_profile_fields($user) {
    $cats = get_user_meta($user->ID, 'interested_categories', true);
    $cats = is_array($cats) ? $cats : array();
    $all_cats = function_exists('engine_job_category_options') ? engine_job_category_options() : array('エキストラ', '音響スタッフ', '照明スタッフ', '撮影・カメラ', '制作・AD', 'イベント運営', 'その他');
    $types = function_exists('engine_user_type_options') ? engine_user_type_options() : array('学生', '社会人（業界未経験）', '経験者');
    $user_type = get_user_meta($user->ID, 'user_type', true);
    $nl = get_user_meta($user->ID, 'newsletter_opt_in', true);
    ?>
    <h2>エンジン 会員情報</h2>
    <table class="form-table">
        <tr>
            <th><label for="engine_contact_name">お名前</label></th>
            <td><input type="text" name="engine_contact_name" id="engine_contact_name" value="<?php echo esc_attr(get_user_meta($user->ID, 'contact_name', true)); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="engine_phone">電話番号</label></th>
            <td><input type="text" name="engine_phone" id="engine_phone" value="<?php echo esc_attr(get_user_meta($user->ID, 'phone', true)); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="engine_birthdate">生年月日</label></th>
            <td><input type="date" name="engine_birthdate" id="engine_birthdate" value="<?php echo esc_attr(get_user_meta($user->ID, 'birthdate', true)); ?>" /></td>
        </tr>
        <tr>
            <th><label for="engine_user_type">区分</label></th>
            <td>
                <select name="engine_user_type" id="engine_user_type">
                    <option value="">未設定</option>
                    <?php foreach ($types as $t) : ?>
                        <option value="<?php echo esc_attr($t); ?>"<?php selected($user_type, $t); ?>><?php echo esc_html($t); ?></option>
                    <?php endforeach; ?>
                </select>
            </td>
        </tr>
        <tr>
            <th>興味のある職種</th>
            <td>
                <?php foreach ($all_cats as $c) : ?>
                    <label style="display:inline-block;margin-right:12px;">
                        <input type="checkbox" name="engine_interested_categories[]" value="<?php echo esc_attr($c); ?>"<?php checked(in_array($c, $cats, true)); ?> />
                        <?php echo esc_html($c); ?>
                    </label>
                <?php endforeach; ?>
            </td>
        </tr>
        <tr>
            <th>お知らせ配信</th>
            <td><label><input type="checkbox" name="engine_newsletter_opt_in" value="1"<?php checked($nl, '1'); ?> /> 案件・求人情報のお知らせを受け取る</label></td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'engine_member_profile_fields');
add_action('edit_user_profile', 'engine_member_profile_fields');

function engine_member_save_profile_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return;
    }
    if (isset($_POST['engine_contact_name'])) {
        update_user_meta($user_id, 'contact_name', sanitize_text_field(wp_unslash($_POST['engine_contact_name'])));
    }
    if (isset($_POST['engine_phone'])) {
        update_user_meta($user_id, 'phone', sanitize_text_field(wp_unslash($_POST['engine_phone'])));
    }
    if (isset($_POST['engine_birthdate'])) {
        update_user_meta($user_id, 'birthdate', sanitize_text_field(wp_unslash($_POST['engine_birthdate'])));
    }
    if (isset($_POST['engine_user_type'])) {
        update_user_meta($user_id, 'user_type', sanitize_text_field(wp_unslash($_POST['engine_user_type'])));
    }
    $cats = isset($_POST['engine_interested_categories']) && is_array($_POST['engine_interested_categories'])
        ? array_map('sanitize_text_field', wp_unslash($_POST['engine_interested_categories']))
        : array();
    update_user_meta($user_id, 'interested_categories', $cats);
    update_user_meta($user_id, 'newsletter_opt_in', isset($_POST['engine_newsletter_opt_in']) ? '1' : '0');
}
add_action('personal_options_update', 'engine_member_save_profile_fields');
add_action('edit_user_profile_update', 'engine_member_save_profile_fields');
