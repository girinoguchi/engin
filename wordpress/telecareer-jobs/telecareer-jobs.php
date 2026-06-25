<?php
/**
 * Plugin Name: テレキャリア 案件（求人）管理
 * Description: WordPress 上でエンタメ求人（案件）を追加・編集し、REST API で Next.js 公開サイトへ配信するためのプラグイン。
 * Version: 1.0.0
 * Author: テレキャリア
 *
 * 使い方:
 *  1. このファイルを wp-content/plugins/telecareer-jobs/telecareer-jobs.php に配置
 *  2. 管理画面「プラグイン」で有効化
 *  3. 左メニュー「案件」から新規追加 → 各項目を入力して「公開」
 *  4. Next.js 側の環境変数 WORDPRESS_API_URL に  https://あなたのWP/wp-json  を設定
 *
 * 公開された案件は  /wp-json/wp/v2/job  で取得できます（カスタム項目は meta に含む）。
 */

if (!defined('ABSPATH')) {
    exit;
}

/** 選択肢（Next.js 側 JOB_CATEGORY_OPTIONS / JOB_TYPE_OPTIONS / PAY_TYPE_OPTIONS と揃える） */
function tcj_category_options() {
    return array('エキストラ', '音響スタッフ', '照明スタッフ', '撮影・カメラ', '制作・AD', 'イベント運営', 'その他');
}
function tcj_job_type_options() {
    return array('単発', '中長期案件', '社員募集');
}
function tcj_pay_type_options() {
    return array('', '時給', '日給', '月給', 'その他');
}

/** 案件のカスタム投稿タイプを登録 */
function tcj_register_post_type() {
    register_post_type('job', array(
        'labels' => array(
            'name'          => '案件',
            'singular_name' => '案件',
            'add_new'       => '新規案件を追加',
            'add_new_item'  => '新規案件を追加',
            'edit_item'     => '案件を編集',
            'all_items'     => '案件一覧',
            'menu_name'     => '案件',
        ),
        'public'       => true,
        'show_in_rest' => true, // REST API 公開（Next.js が取得）
        'rest_base'    => 'job',
        'menu_icon'    => 'dashicons-megaphone',
        'supports'     => array('title', 'editor'), // タイトルと本文エディタ
        'has_archive'  => 'jobs',                    // 一覧アーカイブ /jobs/
        'rewrite'      => array('slug' => 'jobs'),   // 個別ページ /jobs/{slug}
    ));
}
add_action('init', 'tcj_register_post_type');

/** カスタム項目（post meta）を REST に公開して登録 */
function tcj_register_meta() {
    $keys = array(
        'category'    => 'string',
        'job_type'    => 'string',
        'location'    => 'string',
        'pay'         => 'string',
        'pay_type'    => 'string',
        'wage_min'    => 'string',
        'work_period' => 'string',
        'headcount'   => 'string',
        'deadline'    => 'string',
        'tags'        => 'string',
        'is_active'   => 'string',
    );
    foreach ($keys as $key => $type) {
        register_post_meta('job', $key, array(
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
            'auth_callback' => function ($allowed, $meta_key, $post_id) {
                if (get_post_status($post_id) === 'publish') {
                    return true;
                }
                return current_user_can('edit_post', $post_id);
            },
        ));
    }
}
add_action('init', 'tcj_register_meta');

/** Next.js のキャッシュを再検証する（案件の保存・削除時） */
function tcj_get_revalidate_endpoint() {
    $url = getenv('NEXT_REVALIDATE_URL');
    if (!$url) {
        $url = get_option('tcj_next_revalidate_url');
    }
    return $url ? rtrim($url, '/') : '';
}

function tcj_get_revalidate_secret() {
    $secret = getenv('REVALIDATE_SECRET');
    if (!$secret) {
        $secret = get_option('tcj_revalidate_secret');
    }
    return $secret ? (string) $secret : '';
}

function tcj_notify_next_revalidate($post_id) {
    if (wp_is_post_revision($post_id)) {
        return;
    }
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'job') {
        return;
    }

    $endpoint = tcj_get_revalidate_endpoint();
    $secret = tcj_get_revalidate_secret();
    if ($endpoint === '' || $secret === '') {
        return;
    }

    wp_remote_post($endpoint, array(
        'timeout' => 5,
        'blocking' => false,
        'headers' => array('Content-Type' => 'application/json'),
        'body' => wp_json_encode(array(
            'secret' => $secret,
            'tag' => 'jobs',
        )),
    ));
}
add_action('save_post_job', 'tcj_notify_next_revalidate', 20);
add_action('deleted_post', function ($post_id) {
    tcj_notify_next_revalidate($post_id);
}, 20);

/** 入力用メタボックスを追加 */
function tcj_add_meta_box() {
    add_meta_box('tcj_job_fields', '案件の詳細', 'tcj_render_meta_box', 'job', 'normal', 'high');
}
add_action('add_meta_boxes', 'tcj_add_meta_box');

function tcj_render_meta_box($post) {
    wp_nonce_field('tcj_save_meta', 'tcj_meta_nonce');
    $get = function ($k) use ($post) {
        return esc_attr(get_post_meta($post->ID, $k, true));
    };
    $is_active = get_post_meta($post->ID, 'is_active', true);
    if ($is_active === '') {
        $is_active = '1';
    }
    $field = function ($label, $name, $value, $placeholder = '', $type = 'text') {
        echo '<p style="margin:12px 0;">';
        echo '<label style="display:block;font-weight:600;margin-bottom:4px;">' . esc_html($label) . '</label>';
        echo '<input type="' . esc_attr($type) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" placeholder="' . esc_attr($placeholder) . '" style="width:100%;max-width:480px;padding:6px 8px;" />';
        echo '</p>';
    };
    $select = function ($label, $name, $value, $options) {
        echo '<p style="margin:12px 0;">';
        echo '<label style="display:block;font-weight:600;margin-bottom:4px;">' . esc_html($label) . '</label>';
        echo '<select name="' . esc_attr($name) . '" style="min-width:240px;padding:6px 8px;">';
        foreach ($options as $opt) {
            $sel = ((string)$value === (string)$opt) ? ' selected' : '';
            $disp = $opt === '' ? '（未設定）' : $opt;
            echo '<option value="' . esc_attr($opt) . '"' . $sel . '>' . esc_html($disp) . '</option>';
        }
        echo '</select></p>';
    };

    echo '<div style="max-width:520px;">';
    $select('案件種別（大きな枠）', 'job_type', get_post_meta($post->ID, 'job_type', true) ?: '単発', tcj_job_type_options());
    $select('職種', 'category', get_post_meta($post->ID, 'category', true) ?: 'エキストラ', tcj_category_options());
    $field('勤務地', 'location', $get('location'), '例: 東京都港区');
    $field('報酬・給与（表示用テキスト）', 'pay', $get('pay'), '例: 日給 12,000円〜');
    $select('報酬形態（絞り込み用）', 'pay_type', get_post_meta($post->ID, 'pay_type', true), tcj_pay_type_options());
    $field('時給の下限（円・絞り込み用）', 'wage_min', $get('wage_min'), '例: 1300', 'number');
    $field('期間・雇用形態', 'work_period', $get('work_period'), '例: 単発（1日） / 中長期（3ヶ月〜） / 正社員');
    $field('募集人数', 'headcount', $get('headcount'), '例: 5', 'number');
    $field('応募締切', 'deadline', $get('deadline'), '', 'date');
    $field('タグ（スペースまたはカンマ区切り）', 'tags', $get('tags'), '例: 未経験歓迎 学生歓迎 単発');

    echo '<p style="margin:12px 0;"><label style="font-weight:600;"><input type="checkbox" name="is_active" value="1"' . checked($is_active, '1', false) . ' /> 公開する（応募者に表示）</label></p>';
    echo '<p style="color:#666;">※ 募集内容（本文）は上の本文エディタに入力してください。</p>';
    echo '</div>';
}

/** 保存処理 */
function tcj_save_meta($post_id) {
    if (!isset($_POST['tcj_meta_nonce']) || !wp_verify_nonce($_POST['tcj_meta_nonce'], 'tcj_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $text_keys = array('category', 'job_type', 'location', 'pay', 'pay_type', 'wage_min', 'work_period', 'headcount', 'deadline', 'tags');
    foreach ($text_keys as $key) {
        if (isset($_POST[$key])) {
            update_post_meta($post_id, $key, sanitize_text_field(wp_unslash($_POST[$key])));
        }
    }
    // チェックボックスは未チェック時に送信されないため明示的に 0/1 を保存
    update_post_meta($post_id, 'is_active', isset($_POST['is_active']) ? '1' : '0');
}
add_action('save_post_job', 'tcj_save_meta');

/** 一覧画面に種別・職種の列を追加（管理しやすく） */
function tcj_columns($cols) {
    $new = array();
    foreach ($cols as $k => $v) {
        $new[$k] = $v;
        if ($k === 'title') {
            $new['job_type'] = '種別';
            $new['category'] = '職種';
        }
    }
    return $new;
}
add_filter('manage_job_posts_columns', 'tcj_columns');

function tcj_column_content($col, $post_id) {
    if ($col === 'job_type' || $col === 'category') {
        echo esc_html(get_post_meta($post_id, $col, true));
    }
}
add_action('manage_job_posts_custom_column', 'tcj_column_content', 10, 2);
