<?php
/**
 * 共通フッター。ブランド／メニュー／運営会社の3カラム＋下部に規約・著作権。
 * 「求人を探す」「マイページ（お問い合わせ）」はログイン時のみ表示。
 */
if (!defined('ABSPATH')) {
    exit;
}
$logged_in = is_user_logged_in();
?>
    <footer class="bg-telecareer-dark text-gray-400 text-sm mt-20 relative overflow-hidden">
        <div class="flex h-2">
            <span class="flex-1 bg-telecareer-yellow"></span>
            <span class="flex-1 bg-telecareer-orange"></span>
            <span class="flex-1 bg-telecareer-green"></span>
            <span class="flex-1 bg-telecareer-coral"></span>
        </div>

        <div class="mx-auto max-w-6xl px-4 py-14">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">

                <!-- ブランド -->
                <div class="lg:col-span-5">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center gap-2.5 mb-4">
                        <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-telecareer-orange border-2 border-ink text-white font-black">E</span>
                        <span class="flex flex-col leading-none">
                            <span class="font-black text-xl text-white tracking-tight">エンジン</span>
                            <span class="text-[11px] text-gray-500 font-bold tracking-wide mt-0.5">エンタメ人材キャリアマッチング</span>
                        </span>
                    </a>
                    <p class="leading-relaxed max-w-md">
                        エンタメ業界で働きたい人の、エンジンになる。バラエティ・ドラマ・芸能マネージャー・CM・配信など、エンタメ特化の求人をお届けします。未経験から始められる仕事も多数。
                    </p>
                    <div class="mt-5 flex flex-wrap items-center gap-2">
                        <?php if (!$logged_in) : ?>
                            <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-white/10 text-telecareer-text-on-dark border border-white/10">未経験OK</span>
                        <?php endif; ?>
                        <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-white/10 text-telecareer-text-on-dark border border-white/10">登録無料</span>
                        <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-white/10 text-telecareer-text-on-dark border border-white/10">by テレキャリア</span>
                    </div>
                </div>

                <!-- メニュー -->
                <nav class="lg:col-span-3" aria-label="フッターメニュー">
                    <h3 class="text-telecareer-text-on-dark font-black mb-4 tracking-wide">メニュー</h3>
                    <ul class="space-y-2.5">
                        <li><a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-telecareer-yellow transition-colors">トップ</a></li>
                        <?php if ($logged_in) : ?>
                            <li><a href="<?php echo esc_url(home_url('/jobs')); ?>" class="hover:text-telecareer-yellow transition-colors">求人を探す</a></li>
                            <li><a href="<?php echo esc_url(home_url('/mypage')); ?>" class="hover:text-telecareer-yellow transition-colors">マイページ</a></li>
                            <li><a href="<?php echo esc_url(home_url('/mypage#contact')); ?>" class="hover:text-telecareer-yellow transition-colors">お問い合わせ</a></li>
                            <li><a href="<?php echo esc_url(wp_logout_url(home_url('/'))); ?>" class="hover:text-telecareer-yellow transition-colors">ログアウト</a></li>
                        <?php else : ?>
                            <li><a href="<?php echo esc_url(home_url('/login')); ?>" class="hover:text-telecareer-yellow transition-colors">ログイン</a></li>
                            <li><a href="<?php echo esc_url(home_url('/signup')); ?>" class="hover:text-telecareer-yellow transition-colors">会員登録（無料）</a></li>
                        <?php endif; ?>
                    </ul>
                </nav>

                <!-- 運営会社・サポート -->
                <div class="lg:col-span-4">
                    <h3 class="text-telecareer-text-on-dark font-black mb-4 tracking-wide">運営会社</h3>
                    <ul class="space-y-2.5">
                        <li><a href="https://www.f-its.co.jp/" target="_blank" rel="noopener noreferrer" class="hover:text-telecareer-yellow transition-colors">株式会社フォーミュレーションI.T.S. ↗</a></li>
                        <li><a href="https://www.f-its.co.jp/about/" target="_blank" rel="noopener noreferrer" class="hover:text-telecareer-yellow transition-colors">会社概要 ↗</a></li>
                        <li><a href="https://www.f-its.co.jp/recruit/" target="_blank" rel="noopener noreferrer" class="hover:text-telecareer-yellow transition-colors">新卒採用の方はこちら ↗</a></li>
                        <li><a href="<?php echo esc_url(admin_url()); ?>" class="hover:text-telecareer-yellow transition-colors">管理者ログイン（案件入稿）</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
                <span>&copy; <?php echo esc_html(date_i18n('Y')); ?> エンジン（株式会社フォーミュレーションI.T.S.）All Rights Reserved.</span>
                <span class="flex items-center gap-5">
                    <a href="<?php echo esc_url(home_url('/terms')); ?>" class="hover:text-telecareer-yellow transition-colors">利用規約</a>
                    <a href="<?php echo esc_url(home_url('/privacy')); ?>" class="hover:text-telecareer-yellow transition-colors">プライバシーポリシー</a>
                </span>
            </div>
        </div>
    </footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
