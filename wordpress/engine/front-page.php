<?php
/**
 * トップページ。エンタメ業界専門求人「エンジン」のLP。
 * 背景に「携わってきた番組・現場」のロゴを流すヒーロー、実績、職種例、利用の流れ、CTA。
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();

$categories = array(
    array('name' => 'エキストラ',   'desc' => 'ドラマ・映画・CMの撮影に参加。未経験・学生も歓迎。', 'ring' => 'bg-telecareer-yellow'),
    array('name' => '制作・AD',     'desc' => 'テレビ・映像制作のアシスタント。業界デビューの第一歩に。', 'ring' => 'bg-telecareer-orange'),
    array('name' => '音響スタッフ', 'desc' => 'ライブ・イベントの音響設営やPA補助。研修ありの求人も。', 'ring' => 'bg-telecareer-coral'),
    array('name' => '照明スタッフ', 'desc' => 'ステージ・撮影現場のライティング。光で空間を演出。', 'ring' => 'bg-telecareer-green'),
    array('name' => '撮影・カメラ', 'desc' => '番組・配信・Web動画の撮影サポートやカメラ補助。', 'ring' => 'bg-telecareer-yellow'),
    array('name' => 'イベント運営', 'desc' => 'コンサート・イベントの設営や運営スタッフ。単発も多数。', 'ring' => 'bg-telecareer-coral'),
);

$works = array(
    array('network' => '日本テレビ', 'shows' => array('世界の果てまでイッテQ!', '月曜から夜ふかし', '有吉の壁', 'ZIP!')),
    array('network' => 'テレビ朝日', 'shows' => array('ミュージックステーション', 'ロンドンハーツ', 'Qさま!!', 'グッド！モーニング')),
    array('network' => 'TBSテレビ', 'shows' => array('ラヴィット！', '水曜日のダウンタウン', '王様のブランチ')),
    array('network' => 'フジテレビ', 'shows' => array('新しいカギ', '全力！脱力タイムズ', 'めざましテレビ')),
    array('network' => 'ドラマ', 'shows' => array('VIVANT', 'ブラッシュアップライフ', 'どうする家康')),
    array('network' => '配信コンテンツ', 'shows' => array('ABEMA', 'Netflix', 'TVer', 'YouTube')),
    array('network' => 'CM', 'shows' => array('大手広告会社・CM制作会社の現場')),
    array('network' => 'その他（テレビ東京・NHK 等）', 'shows' => array('チコちゃんに叱られる！', 'プレバト！！', '乃木坂工事中')),
);

$steps = array(
    array(
        'no'    => '01',
        'title' => '無料で会員登録',
        'body'  => '名前・連絡先などをご登録（1分）。費用は一切かかりません。',
        'bg'    => 'bg-telecareer-yellow',
        'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    ),
    array(
        'no'    => '02',
        'title' => 'キャリア相談・求人紹介',
        'body'  => 'アドバイザーがあなたの希望や適性をうかがい、ぴったりの求人をご紹介します。',
        'bg'    => 'bg-telecareer-coral',
        'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    ),
    array(
        'no'    => '03',
        'title' => '気になる求人に応募',
        'body'  => '紹介された求人や気になる求人に応募。現場デビューまでサポートします。',
        'bg'    => 'bg-telecareer-green',
        'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>',
    ),
);

// トップビジュアルの「メディア実績ロゴウォール」。運営会社が携わってきた番組・現場の一例。
$media_logos = array(
    array('f' => 'ravit.png',            'a' => 'ラヴィット！'),
    array('f' => 'suiyoubi-downtown.png', 'a' => '水曜日のダウンタウン'),
    array('f' => 'zip.png',              'a' => 'ZIP！'),
    array('f' => 'matsuko-sekai.png',    'a' => 'マツコの知らない世界'),
    array('f' => 'ariyoshi-kabe.png',    'a' => '有吉の壁'),
    array('f' => 'yofukashi.png',        'a' => '月曜から夜ふかし'),
    array('f' => 'sukatto-japan.jpg',    'a' => 'スカッとジャパン'),
    array('f' => '24h-tv.jpg',           'a' => '24時間テレビ'),
    array('f' => 'vs-tamashii.jpg',      'a' => 'VS魂'),
    array('f' => 'jobtune.jpg',          'a' => 'ジョブチューン'),
    array('f' => 'taiikukai-tv.jpg',     'a' => '炎の体育会TV'),
    array('f' => 'samaa-resort.jpg',     'a' => '世界さまぁ〜リゾート'),
    array('f' => 'chidori-kamaitachi.png', 'a' => '千鳥かまいたちゴールデンアワー'),
    array('f' => 'golden-sixtones.png',  'a' => 'ゴールデンSixTONES'),
    array('f' => 'snowman.png',          'a' => 'それSnow Manにやらせて下さい'),
    array('f' => 'arashi-shiyagare.jpg', 'a' => '嵐にしやがれ'),
    array('f' => 'viking-more.png',      'a' => 'バイキングMORE'),
    array('f' => 'popup.png',            'a' => 'ぽかぽか／ポップUP！'),
    array('f' => 'quiz-iwakan.png',      'a' => 'クイズ違和感'),
    array('f' => 'pittanko.png',         'a' => 'ぴったんこカン☆カン'),
    array('f' => 'matsuko-kaigi.jpg',    'a' => 'マツコ会議'),
    array('f' => 'nippon-atama.jpg',     'a' => 'ニッポン人の頭の中'),
    array('f' => 'nobunaka.jpg',         'a' => 'ノブナカなんなん？'),
    array('f' => 'ueda-hoeru.png',       'a' => '上田と女が吠える夜'),
    array('f' => 'minna-doubutsuen.jpg', 'a' => '嗚呼!!みんなの動物園'),
    array('f' => 'doubutsu-peace.jpg',   'a' => 'どうぶつピース!!'),
    array('f' => 'zoo-1.jpg',            'a' => 'Zoo-1グランプリ'),
    array('f' => 'junk-sports.jpg',      'a' => 'ジャンクSPORTS'),
    array('f' => 'moshimo-tours.jpg',    'a' => 'もしもツアーズ'),
    array('f' => 'fns-27h.jpg',          'a' => 'FNS27時間テレビ'),
    array('f' => 'bakugai-star.jpg',     'a' => '爆買いスター恩返し'),
    array('f' => 'chouzetsu-genkai.jpg', 'a' => '超絶限界'),
    array('f' => 'hitomede-wakaru.jpg',  'a' => 'ひと目でわかる!!'),
    array('f' => 'torechaimashita.jpg',  'a' => '撮れちゃいました'),
    array('f' => 'ganjitsu-surprise.jpg', 'a' => '元日サプライズ'),
    array('f' => 'tokoro-japan.jpg',     'a' => '所JAPAN'),
    array('f' => 'ntv-show.jpg',         'a' => 'テレビ番組'),
);

// 背景マーキー用に複数行へ振り分け
$media_uri = get_template_directory_uri() . '/assets/img/media/';
$row_count = 5;
$media_rows = array_fill(0, $row_count, array());
foreach ($media_logos as $idx => $logo) {
    $media_rows[$idx % $row_count][] = $logo;
}
$row_durations = array('72s', '88s', '64s', '94s', '78s');
?>

<main class="flex-1">
    <!-- ===== Hero（明るい配色／背景に流れるメディア実績ロゴ） ===== -->
    <section class="bg-telecareer-hero relative overflow-hidden border-b-2 border-ink">
        <!-- 背景：流れるロゴ（装飾） -->
        <div class="absolute inset-0 z-0 flex flex-col justify-center gap-3 md:gap-4 select-none pointer-events-none" aria-hidden="true">
            <?php foreach ($media_rows as $r => $row) : ?>
                <div class="logo-marquee logo-marquee--bg<?php echo $r % 2 === 1 ? ' logo-marquee--reverse' : ''; ?>">
                    <div class="logo-marquee__track" style="--marquee-duration: <?php echo esc_attr($row_durations[$r]); ?>;">
                        <?php for ($dup = 0; $dup < 2; $dup++) : ?>
                            <?php foreach ($row as $logo) : ?>
                                <div class="logo-tile">
                                    <img src="<?php echo esc_url($media_uri . $logo['f']); ?>" alt="" loading="lazy" decoding="async" width="168" height="96" />
                                </div>
                            <?php endforeach; ?>
                        <?php endfor; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <!-- 可読性確保のオーバーレイ（中央を濃く、左右はロゴが見える） -->
        <div class="absolute inset-0 z-[1] tc-hero-veil" aria-hidden="true"></div>

        <!-- コンテンツ -->
        <div class="mx-auto max-w-5xl px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10 flex flex-col items-center text-center">
            <span class="tc-eyebrow bg-white">エンタメ人材キャリアマッチング</span>
            <h1 class="mt-6 text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight text-telecareer-ink">
                エンタメ業界専門求人<span class="tc-marker">エンジン</span><br class="hidden sm:block" />
                <span class="text-2xl sm:text-3xl md:text-4xl">by テレキャリア</span>
            </h1>
            <p class="mt-6 text-base sm:text-lg text-gray-700 max-w-2xl font-medium">
                エキストラ、バラエティ、ドラマ、芸能マネージャー、CM、配信など、<br class="hidden sm:block" />
                エンタメ特化の求人が見つかる。未経験から始められる仕事も多数。
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <a href="<?php echo esc_url(home_url('/signup')); ?>" class="btn-cta btn-flashy px-10 py-4 font-bold text-lg w-full sm:w-auto">無料で会員登録 →</a>
            </div>
            <div class="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-gray-700">
                <?php if (!is_user_logged_in()) : ?>
                    <span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-telecareer-yellow"></span>未経験OK</span>
                <?php endif; ?>
                <span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-telecareer-coral"></span>全部無料</span>
            </div>
            <p class="mt-8 text-sm md:text-base font-black text-telecareer-ink">
                誰もが知る、<span class="tc-marker">あの番組・現場</span>とつながっています。
            </p>
        </div>
    </section>

    <!-- ===== 実績（各局・各社とのつながり） ===== -->
    <section class="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div class="text-center mb-12">
            <span class="tc-eyebrow bg-white">WORKS</span>
            <h2 class="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">これまで携わった主な現場</h2>
            <p class="mt-4 text-gray-600 font-medium">実績ある会社が運営。誰もが知るテレビ番組・ドラマ・大手CM・配信の現場とつながっています。</p>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <?php foreach ($works as $w) : ?>
                <div class="tc-card-soft p-5">
                    <h3 class="font-black text-telecareer-ink border-b-2 border-telecareer-orange/40 pb-2 mb-3"><?php echo esc_html($w['network']); ?></h3>
                    <ul class="space-y-1.5">
                        <?php foreach ($w['shows'] as $s) : ?>
                            <li class="flex items-start gap-2 text-sm text-gray-700">
                                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-telecareer-orange shrink-0"></span>
                                <span><?php echo esc_html($s); ?></span>
                            </li>
                        <?php endforeach; ?>
                        <li class="text-xs text-gray-400 pt-1">ほか多数</li>
                    </ul>
                </div>
            <?php endforeach; ?>
        </div>
        <p class="mt-6 text-xs text-gray-400 text-center max-w-3xl mx-auto">
            ※ 運営会社（株式会社フォーミュレーションI.T.S.）の配属実績の一部です。番組名は各放送局・制作会社の権利に帰属します。
        </p>
    </section>

    <!-- ===== カテゴリ（こんな求人があります） ===== -->
    <section class="bg-white border-y-2 border-ink">
        <div class="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div class="text-center mb-12">
                <span class="tc-eyebrow bg-telecareer-surface">CATEGORY</span>
                <h2 class="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">例えば、こんなお仕事。</h2>
                <p class="mt-4 text-gray-600 font-medium">エンタメの現場には、さまざまな仕事があります。未経験から始められるものも多数。</p>
            </div>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <?php foreach ($categories as $c) : ?>
                    <div class="tc-card tc-card-hover p-6 flex items-start gap-4">
                        <span class="w-12 h-12 rounded-2xl border-2 border-ink shrink-0 <?php echo esc_attr($c['ring']); ?>"></span>
                        <div>
                            <h3 class="font-bold text-lg text-telecareer-ink"><?php echo esc_html($c['name']); ?></h3>
                            <p class="mt-1 text-sm text-gray-600 leading-relaxed"><?php echo esc_html($c['desc']); ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="mt-10 text-center">
                <a href="<?php echo esc_url(home_url('/signup')); ?>" class="btn-cta px-8 py-3.5 font-bold text-base">無料登録して求人を見る →</a>
            </div>
        </div>
    </section>

    <!-- ===== 使い方 ===== -->
    <section class="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div class="text-center mb-12">
            <span class="tc-eyebrow bg-white">HOW IT WORKS</span>
            <h2 class="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">ご利用の流れ</h2>
            <p class="mt-4 text-gray-600 font-medium">初めての方でも、たった3ステップ。登録から現場デビューまでサポートします。</p>
        </div>

        <div class="grid gap-8 md:grid-cols-3 md:gap-4 relative">
            <?php foreach ($steps as $i => $s) : ?>
                <div class="relative flex flex-col items-center text-center">
                    <?php if ($i > 0) : ?>
                        <span class="hidden md:flex absolute -left-2 top-12 -translate-x-1/2 -translate-y-1/2 text-telecareer-ink/30 z-10" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><polyline points="9 6 15 12 9 18"/></svg>
                        </span>
                    <?php endif; ?>

                    <div class="tc-card tc-card-hover p-7 w-full flex flex-col items-center h-full">
                        <div class="relative">
                            <span class="w-24 h-24 rounded-full border-2 border-ink flex items-center justify-center text-ink <?php echo esc_attr($s['bg']); ?> shadow-[3px_3px_0_0_rgba(31,31,31,1)]">
                                <?php echo $s['icon']; // phpcs:ignore ?>
                            </span>
                            <span class="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-ink flex items-center justify-center font-black text-telecareer-ink text-sm"><?php echo esc_html((string) ($i + 1)); ?></span>
                        </div>
                        <span class="mt-5 tag-pill tag-plain text-xs">STEP <?php echo esc_html($s['no']); ?></span>
                        <h3 class="mt-3 text-xl font-bold text-telecareer-ink"><?php echo esc_html($s['title']); ?></h3>
                        <p class="mt-2 text-gray-600 leading-relaxed text-sm"><?php echo esc_html($s['body']); ?></p>
                    </div>

                    <?php if ($i < count($steps) - 1) : ?>
                        <span class="md:hidden text-telecareer-ink/30 mt-3" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><polyline points="6 9 12 15 18 9"/></svg>
                        </span>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="mt-12 text-center">
            <a href="<?php echo esc_url(home_url('/signup')); ?>" class="btn-cta px-8 py-3.5 font-bold text-base">無料で会員登録してはじめる →</a>
        </div>
    </section>

    <!-- ===== 運営会社（フォーミュレーションI.T.S.） ===== -->
    <section class="bg-white border-y-2 border-ink" id="about">
        <div class="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div class="text-center mb-12">
                <span class="tc-eyebrow bg-telecareer-surface">ABOUT US</span>
                <h2 class="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">テレビ業界に強い人材会社が運営しています</h2>
                <p class="mt-5 text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
                    「どこの誰が運営しているか分からない」という不安はいりません。エンジンを運営するのは、長年テレビ・エンタメ業界に人材を送り出してきた会社です。
                </p>
            </div>

            <div class="grid gap-8 lg:grid-cols-5 items-start">
                <!-- 説明＋安心ポイント -->
                <div class="lg:col-span-3">
                    <p class="text-gray-700 leading-relaxed mb-6">
                        運営は<strong class="text-telecareer-ink">株式会社フォーミュレーションI.T.S.</strong>。2011年からテレビ局や制作会社に人材を送り出してきた、メディア業界専門の人材会社です。親会社は1986年創業、テレビ・CM業界で活躍するリサーチ会社「フォーミュレーション」。長年つちかったネットワークで、テレビ番組・ドラマ・映画・大手CM・配信・イベントなど“本物の現場”とつながっています。
                    </p>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <?php
                        $about_points = array(
                            array('h' => '実在する人材会社が運営', 'p' => '人材派遣・有料職業紹介の許可を受けた事業者です。', 'c' => 'bg-telecareer-yellow'),
                            array('h' => 'テレビ業界に深いネットワーク', 'p' => '1986年創業の親会社と2011年創業のI.T.S.。だから紹介する現場が“本物”です。', 'c' => 'bg-telecareer-orange'),
                            array('h' => '未経験からのスタートを多数サポート', 'p' => 'もともと未経験の人を数多く受け入れてきた会社。だから「未経験OK」は本当です。', 'c' => 'bg-telecareer-coral'),
                            array('h' => '相談できるサポート体制', 'p' => '現場経験のあるスタッフが在籍。業界のことを知る人がそばにいます。', 'c' => 'bg-telecareer-green'),
                        );
                        foreach ($about_points as $ap) :
                        ?>
                            <div class="tc-card-soft p-5 flex items-start gap-3">
                                <span class="w-9 h-9 rounded-xl border-2 border-ink shrink-0 <?php echo esc_attr($ap['c']); ?>"></span>
                                <div>
                                    <h3 class="font-bold text-telecareer-ink text-sm"><?php echo esc_html($ap['h']); ?></h3>
                                    <p class="mt-1 text-xs text-gray-600 leading-relaxed"><?php echo esc_html($ap['p']); ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- 会社概要 -->
                <div class="lg:col-span-2">
                    <div class="tc-card p-6">
                        <h3 class="font-black text-telecareer-ink mb-4 border-b-2 border-telecareer-orange/40 pb-2">会社概要</h3>
                        <?php
                        $company_info = array(
                            '商号'     => '株式会社フォーミュレーションI.T.S.',
                            '設立'     => '2011年',
                            '所在地'   => '東京都渋谷区東1-26-20 東京建物東渋谷ビル B1F',
                            '事業内容' => '人材派遣業／有料職業紹介業／テレビ番組などメディアの企画制作',
                            '関連会社' => '株式会社フォーミュレーション',
                        );
                        ?>
                        <dl class="space-y-3 text-sm">
                            <?php foreach ($company_info as $k => $v) : ?>
                                <div>
                                    <dt class="text-gray-500 font-bold text-xs"><?php echo esc_html($k); ?></dt>
                                    <dd class="text-ink mt-0.5"><?php echo esc_html($v); ?></dd>
                                </div>
                            <?php endforeach; ?>
                        </dl>
                        <a href="https://www.f-its.co.jp/about/" target="_blank" rel="noopener noreferrer" class="link-accent inline-block mt-4 text-sm">会社概要を見る ↗</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== お問い合わせ / 会員登録 CTA ===== -->
    <section class="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div class="tc-card bg-telecareer-hero border-ink p-10 md:p-14 text-center relative overflow-hidden">
            <h2 class="text-2xl md:text-4xl font-black text-telecareer-ink relative">まずは、気軽に一歩を。</h2>
            <p class="mt-4 text-gray-700 font-medium relative">会員登録は無料。未経験から挑戦できる求人もたくさんあります。ご相談だけでも歓迎です。</p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative">
                <a href="<?php echo esc_url(home_url('/signup')); ?>" class="btn-cta btn-flashy px-10 py-4 font-bold text-lg">無料で会員登録 →</a>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();
