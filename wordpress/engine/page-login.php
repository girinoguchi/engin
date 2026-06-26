<?php
/**
 * Template Name: ログイン（エンジン）
 * ログインページ（Next.js 版 src/app/login/page.tsx を移植）。送信は engine_login が処理。
 */
if (!defined('ABSPATH')) {
    exit;
}

if (is_user_logged_in()) {
    wp_safe_redirect(home_url('/jobs'));
    exit;
}

get_header();
$flash = engine_flash_from_query();
?>
<main class="mx-auto max-w-md px-4 py-14 flex-1 w-full">
    <span class="tc-eyebrow bg-white">LOGIN</span>
    <h1 class="mt-4 text-3xl font-black text-telecareer-ink mb-6"><span class="tc-marker">ログイン</span></h1>

    <?php if (!empty($flash['notice'])) : ?>
        <div class="text-orange-a11y text-sm bg-telecareer-orange/10 p-4 rounded-xl border-2 border-telecareer-orange mb-4 font-medium"><?php echo esc_html($flash['notice']); ?></div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="space-y-4 tc-card p-6 md:p-7">
        <input type="hidden" name="action" value="engine_login" />
        <?php if (!empty($flash['error'])) : ?>
            <div class="text-coral-a11y text-sm bg-telecareer-coral/10 p-4 rounded-xl border-2 border-telecareer-coral"><?php echo esc_html($flash['error']); ?></div>
        <?php endif; ?>
        <div>
            <label class="tc-label">メールアドレス</label>
            <input type="email" name="email" required class="tc-input" />
        </div>
        <div>
            <label class="tc-label">パスワード</label>
            <input type="password" name="password" required class="tc-input" />
        </div>
        <button type="submit" class="w-full btn-cta py-3 font-bold">ログイン</button>
    </form>
    <p class="mt-5 text-center text-sm text-gray-600">
        <a href="<?php echo esc_url(home_url('/signup')); ?>" class="link-accent">会員登録はこちら →</a>
    </p>
</main>
<?php
get_footer();
