<?php
/**
 * エンジン テーマの共通処理・ヘルパー。
 * - アセット読み込み（Tailwind ビルド済み main.css / LP 用 CSS・フォント・JS）
 * - 求人（job CPT）のデータ取得・絞り込み（Next.js 版 filterJobs を移植）
 * - 各種選択肢（Next.js 版 *_OPTIONS と同期）
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ENGINE_VERSION', '1.0.0');

/* ============================================================
   テーマ基本設定
   ============================================================ */
function engine_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('automatic-feed-links');
    register_nav_menus(array(
        'primary' => 'グローバルナビ',
    ));
}
add_action('after_setup_theme', 'engine_setup');

/* ============================================================
   アセット読み込み
   ============================================================ */
function engine_assets() {
    $dir = get_template_directory();
    $uri = get_template_directory_uri();

    // 共通スタイル（Tailwind ビルド済み）
    $main = $dir . '/assets/css/main.css';
    wp_enqueue_style(
        'engine-main',
        $uri . '/assets/css/main.css',
        array(),
        file_exists($main) ? filemtime($main) : ENGINE_VERSION
    );

    // 追加スタイル（派手なCTAなど。main.css の後に読み込む）
    $extra = $dir . '/assets/css/extra.css';
    if (file_exists($extra)) {
        wp_enqueue_style(
            'engine-extra',
            $uri . '/assets/css/extra.css',
            array('engine-main'),
            filemtime($extra)
        );
    }

    // 広告用 LP テンプレートのときだけ、専用フォント・CSS・計測JSを読み込む
    if (is_page_template('page-lp-entame.php')) {
        wp_enqueue_style(
            'engine-lp-fonts',
            'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap',
            array(),
            null
        );
        $lp = $dir . '/assets/css/lp.css';
        wp_enqueue_style(
            'engine-lp',
            $uri . '/assets/css/lp.css',
            array('engine-main'),
            file_exists($lp) ? filemtime($lp) : ENGINE_VERSION
        );
        $lpjs = $dir . '/assets/js/lp.js';
        wp_enqueue_script(
            'engine-lp',
            $uri . '/assets/js/lp.js',
            array(),
            file_exists($lpjs) ? filemtime($lpjs) : ENGINE_VERSION,
            true
        );
        wp_localize_script('engine-lp', 'ENGINE_LP', array(
            'gadsId'    => (string) get_option('engine_gads_id', ''),
            'gadsLabel' => (string) get_option('engine_gads_signup_label', ''),
        ));
    }
}
add_action('wp_enqueue_scripts', 'engine_assets');

/** 広告用LP のみ：GA4 / Meta Pixel の基本タグを出力（IDが設定されている場合のみ） */
function engine_lp_tracking_tags() {
    if (!is_page_template('page-lp-entame.php')) {
        return;
    }
    $ga4   = get_option('engine_ga4_id');
    $gads  = get_option('engine_gads_id');
    $pixel = get_option('engine_meta_pixel_id');

    if ($ga4 || $gads) {
        $primary = $ga4 ? $ga4 : $gads;
        echo "\n<!-- Google tag (gtag.js) -->\n";
        echo '<script async src="https://www.googletagmanager.com/gtag/js?id=' . esc_attr($primary) . '"></script>' . "\n";
        echo '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());';
        if ($ga4) {
            echo 'gtag("config","' . esc_js($ga4) . '");';
        }
        if ($gads) {
            echo 'gtag("config","' . esc_js($gads) . '");';
        }
        echo '</script>' . "\n";
    }

    if ($pixel) {
        echo "\n<!-- Meta Pixel -->\n<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\"2.0\";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,\"script\",\"https://connect.facebook.net/en_US/fbevents.js\");fbq(\"init\",\"" . esc_js($pixel) . "\");fbq(\"track\",\"PageView\");</script>\n";
    }
}
add_action('wp_head', 'engine_lp_tracking_tags', 20);

/* ============================================================
   選択肢（Next.js 版 src/lib/types.ts と同期）
   ============================================================ */
function engine_job_category_options() {
    return array('エキストラ', '音響スタッフ', '照明スタッフ', '撮影・カメラ', '制作・AD', 'イベント運営', 'その他');
}
function engine_job_type_options() {
    return array('単発', '中長期案件', '社員募集');
}
function engine_pay_type_options() {
    return array('時給', '日給', '月給', 'その他');
}
function engine_area_options() {
    return array('東京', '神奈川', '千葉', '埼玉', '大阪', '愛知', 'オンライン');
}
function engine_wage_min_options() {
    return array(
        array('label' => '指定なし', 'value' => ''),
        array('label' => '1,200円以上', 'value' => '1200'),
        array('label' => '1,500円以上', 'value' => '1500'),
        array('label' => '1,800円以上', 'value' => '1800'),
        array('label' => '2,000円以上', 'value' => '2000'),
    );
}
function engine_sort_options() {
    return array(
        array('label' => '新着順', 'value' => 'new'),
        array('label' => '締切が近い順', 'value' => 'deadline'),
        array('label' => '時給が高い順', 'value' => 'wage'),
    );
}
function engine_gender_options() {
    return array('男性', '女性', 'その他', '回答しない');
}
function engine_user_type_options() {
    return array('学生', '社会人（業界未経験）', '経験者');
}
function engine_application_statuses() {
    return array('未対応', '選考中', '完了', '見送り');
}

/* ============================================================
   求人（job CPT）のデータ整形・取得
   ============================================================ */

/** 1件の job 投稿を配列に整形する（Next.js 版 mapWpPostToJob 相当） */
function engine_map_job($post) {
    $id    = $post->ID;
    $meta  = function ($k) use ($id) {
        return (string) get_post_meta($id, $k, true);
    };
    $tagsRaw = $meta('tags');
    $tags = array();
    if ($tagsRaw !== '') {
        foreach (preg_split('/[,\s]+/u', $tagsRaw) as $t) {
            $t = ltrim(trim($t), '#');
            if ($t !== '') {
                $tags[] = $t;
            }
        }
    }
    $wage = $meta('wage_min');
    $head = $meta('headcount');
    $isActive = $meta('is_active');

    return array(
        'id'          => (string) $id,
        'created_at'  => get_post_time('c', true, $post),
        'title'       => get_the_title($post),
        'category'    => $meta('category') !== '' ? $meta('category') : 'その他',
        'job_type'    => $meta('job_type') !== '' ? $meta('job_type') : '単発',
        'body'        => $meta('body') !== '' ? $meta('body') : wp_strip_all_tags($post->post_content),
        'location'    => $meta('location') !== '' ? $meta('location') : null,
        'pay'         => $meta('pay') !== '' ? $meta('pay') : null,
        'pay_type'    => $meta('pay_type') !== '' ? $meta('pay_type') : null,
        'wage_min'    => ($wage !== '' && is_numeric($wage)) ? (int) $wage : null,
        'work_period' => $meta('work_period') !== '' ? $meta('work_period') : null,
        'headcount'   => ($head !== '' && is_numeric($head)) ? (int) $head : null,
        'deadline'    => $meta('deadline') !== '' ? $meta('deadline') : null,
        'tags'        => $tags,
        'is_active'   => !($isActive === '0' || $isActive === 'false'),
    );
}

/** 公開中の全求人を配列で取得 */
function engine_all_jobs() {
    $q = new WP_Query(array(
        'post_type'      => 'job',
        'post_status'    => 'publish',
        'posts_per_page' => 200,
        'orderby'        => 'date',
        'order'          => 'DESC',
        'no_found_rows'  => true,
    ));
    $jobs = array();
    foreach ($q->posts as $p) {
        $jobs[] = engine_map_job($p);
    }
    wp_reset_postdata();
    return $jobs;
}

/** 未経験OK 判定（Next.js 版 matchesInexperienced 相当） */
function engine_job_inexperienced($job) {
    $haystack = $job['title'] . ' ' . $job['body'] . ' ' . implode(' ', $job['tags']);
    return (bool) preg_match('/未経験|初心者|学生歓迎|初めて/u', $haystack);
}

/** キーワード一致（Next.js 版 applyKeyword 相当） */
function engine_job_keyword($job, $q) {
    $needle = mb_strtolower($q);
    $fields = array($job['title'], $job['body'], (string) $job['location'], $job['category']);
    foreach ($fields as $f) {
        if ($f !== '' && mb_strpos(mb_strtolower($f), $needle) !== false) {
            return true;
        }
    }
    foreach ($job['tags'] as $t) {
        if (mb_strpos(mb_strtolower($t), $needle) !== false) {
            return true;
        }
    }
    return false;
}

/** 絞り込み・並び替え（Next.js 版 filterJobs を移植） */
function engine_filter_jobs($jobs, $filters) {
    $result = array_values(array_filter($jobs, function ($j) {
        return $j['is_active'];
    }));

    if (!empty($filters['jobType'])) {
        $result = array_values(array_filter($result, function ($j) use ($filters) {
            return $j['job_type'] === $filters['jobType'];
        }));
    }
    if (!empty($filters['category'])) {
        $result = array_values(array_filter($result, function ($j) use ($filters) {
            return $j['category'] === $filters['category'];
        }));
    }
    if (!empty($filters['payType'])) {
        $result = array_values(array_filter($result, function ($j) use ($filters) {
            return $j['pay_type'] === $filters['payType'];
        }));
    }
    if (!empty($filters['area'])) {
        $result = array_values(array_filter($result, function ($j) use ($filters) {
            return $j['location'] !== null && mb_strpos($j['location'], $filters['area']) !== false;
        }));
    }
    if (!empty($filters['wageMin'])) {
        $min = (int) $filters['wageMin'];
        $result = array_values(array_filter($result, function ($j) use ($min) {
            return $j['wage_min'] !== null && $j['wage_min'] >= $min;
        }));
    }
    if (isset($filters['inexperienced']) && $filters['inexperienced'] === '1') {
        $result = array_values(array_filter($result, 'engine_job_inexperienced'));
    }
    if (!empty($filters['q']) && trim($filters['q']) !== '') {
        $q = trim($filters['q']);
        $result = array_values(array_filter($result, function ($j) use ($q) {
            return engine_job_keyword($j, $q);
        }));
    }

    $sort = isset($filters['sort']) ? $filters['sort'] : 'new';
    if ($sort === 'deadline') {
        usort($result, function ($a, $b) {
            if (!$a['deadline']) return 1;
            if (!$b['deadline']) return -1;
            return strcmp($a['deadline'], $b['deadline']);
        });
    } elseif ($sort === 'wage') {
        usort($result, function ($a, $b) {
            return ($b['wage_min'] ?? 0) - ($a['wage_min'] ?? 0);
        });
    }

    return $result;
}

/** $_GET から絞り込み済みの求人配列を返す */
function engine_get_jobs_from_request() {
    $filters = array(
        'q'             => isset($_GET['q']) ? sanitize_text_field(wp_unslash($_GET['q'])) : '',
        'category'      => isset($_GET['category']) ? sanitize_text_field(wp_unslash($_GET['category'])) : '',
        'jobType'       => isset($_GET['jobType']) ? sanitize_text_field(wp_unslash($_GET['jobType'])) : '',
        'area'          => isset($_GET['area']) ? sanitize_text_field(wp_unslash($_GET['area'])) : '',
        'payType'       => isset($_GET['payType']) ? sanitize_text_field(wp_unslash($_GET['payType'])) : '',
        'wageMin'       => isset($_GET['wageMin']) ? sanitize_text_field(wp_unslash($_GET['wageMin'])) : '',
        'inexperienced' => isset($_GET['inexperienced']) ? sanitize_text_field(wp_unslash($_GET['inexperienced'])) : '',
        'sort'          => isset($_GET['sort']) ? sanitize_text_field(wp_unslash($_GET['sort'])) : '',
    );
    return array('jobs' => engine_filter_jobs(engine_all_jobs(), $filters), 'filters' => $filters);
}

/** ログインユーザーの希望カテゴリに合うおすすめ求人 */
function engine_get_recommended_jobs($user_id, $limit = 3) {
    $cats = get_user_meta($user_id, 'interested_categories', true);
    if (!is_array($cats)) {
        $cats = array();
    }
    $cats = array_values(array_filter($cats));
    if (empty($cats)) {
        return array();
    }
    $jobs = array_filter(engine_all_jobs(), function ($j) use ($cats) {
        return $j['is_active'] && in_array($j['category'], $cats, true);
    });
    return array_slice(array_values($jobs), 0, $limit);
}

/** 1件取得 */
function engine_get_job($id) {
    $post = get_post((int) $id);
    if (!$post || $post->post_type !== 'job' || $post->post_status !== 'publish') {
        return null;
    }
    $job = engine_map_job($post);
    return $job['is_active'] ? $job : null;
}

/* ============================================================
   表示用クラス（Next.js 版 JobCard と同じ色分け）
   ============================================================ */
function engine_category_class($category) {
    $map = array(
        'エキストラ'    => 'tag-yellow',
        '音響スタッフ'  => 'tag-green',
        '照明スタッフ'  => 'tag-orange',
        '撮影・カメラ'  => 'tag-coral',
        '制作・AD'      => 'tag-green',
        'イベント運営'  => 'tag-yellow',
    );
    return isset($map[$category]) ? $map[$category] : 'tag-plain';
}

function engine_job_type_class($job_type) {
    $map = array(
        '単発'        => 'bg-telecareer-coral/15 text-coral-a11y',
        '中長期案件'  => 'bg-telecareer-green/15 text-green-a11y',
        '社員募集'    => 'bg-telecareer-orange/15 text-orange-a11y',
    );
    return isset($map[$job_type]) ? $map[$job_type] : 'bg-gray-100 text-gray-600';
}

/* ============================================================
   URL ヘルパー
   ============================================================ */
function engine_url($path = '/') {
    return home_url($path);
}

/** 現在の検索条件を引き継いだ /jobs URL（overrides で上書き、空は除去） */
function engine_jobs_href($current, $overrides = array()) {
    $merged = array_merge($current, $overrides);
    $params = array();
    $keys = array('q', 'category', 'jobType', 'area', 'payType', 'wageMin', 'inexperienced', 'sort');
    foreach ($keys as $k) {
        if (!empty($merged[$k])) {
            $params[$k] = $merged[$k];
        }
    }
    $base = home_url('/jobs');
    return empty($params) ? $base : $base . '?' . http_build_query($params);
}

/** 締切日の表示整形 */
function engine_format_deadline($deadline) {
    if (!$deadline) {
        return null;
    }
    $ts = strtotime($deadline);
    if ($ts === false) {
        return $deadline;
    }
    return date_i18n('Y年n月j日', $ts);
}

/* ============================================================
   フラッシュメッセージ（フォーム送信後の通知）
   ============================================================ */
function engine_flash_from_query() {
    $messages = array();
    if (isset($_GET['error'])) {
        $map = array(
            'invalid'      => '入力内容に誤りがあります。もう一度ご確認ください。',
            'email_exists' => 'このメールアドレスは既に登録されています。',
            'login_failed' => 'メールアドレスまたはパスワードが正しくありません。',
            'required'     => '必須項目が入力されていません。',
            'password'     => 'パスワードは6文字以上で入力してください。',
        );
        $code = sanitize_text_field(wp_unslash($_GET['error']));
        $messages['error'] = isset($map[$code]) ? $map[$code] : '送信に失敗しました。';
    }
    if (isset($_GET['notice'])) {
        $map = array(
            'login_required' => '求人情報の閲覧には会員登録（無料）・ログインが必要です。',
        );
        $code = sanitize_text_field(wp_unslash($_GET['notice']));
        if (isset($map[$code])) {
            $messages['notice'] = $map[$code];
        }
    }
    return $messages;
}

/* ============================================================
   求人ページ（一覧・詳細）はログイン不要（Next.js 版に合わせる）
   ============================================================ */
function engine_require_login_for_jobs() {
    // 応募・マイページ機能はログイン必須。求人一覧の閲覧は未ログインでも可能。
}
add_action('template_redirect', 'engine_require_login_for_jobs');

/**
 * お問い合わせはマイページ内のみ。単独の /contact は使わずマイページへ集約する。
 */
function engine_redirect_contact_to_mypage() {
    if (is_admin() || !is_main_query()) {
        return;
    }
    if (is_page('contact')) {
        if (is_user_logged_in()) {
            wp_safe_redirect(home_url('/mypage#contact'));
        } else {
            wp_safe_redirect(add_query_arg('notice', 'login_required', home_url('/login')));
        }
        exit;
    }
}
add_action('template_redirect', 'engine_redirect_contact_to_mypage');
