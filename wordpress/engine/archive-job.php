<?php
/**
 * 求人一覧 /jobs（Next.js 版 src/app/jobs/page.tsx を移植）。
 * 雇用形態タブ＋詳細絞り込み、ログイン会員にはおすすめ求人を表示。
 * ※ 求人一覧は未ログインでも閲覧可能（Next.js 版に合わせる）。
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();

$data    = engine_get_jobs_from_request();
$jobs    = $data['jobs'];
$filters = $data['filters'];

$recommended = is_user_logged_in() ? engine_get_recommended_jobs(get_current_user_id(), 3) : array();
?>
<main class="mx-auto max-w-6xl px-4 py-10 flex-1 w-full">
    <div class="mb-8">
        <span class="tc-eyebrow bg-white">JOBS</span>
        <h1 class="mt-4 text-3xl font-black text-telecareer-ink"><span class="tc-marker">求人を探す</span></h1>
        <p class="mt-3 text-gray-600 text-sm">エンタメ業界の求人を、雇用形態・職種・エリア・時給などで絞り込めます。</p>
    </div>

    <?php if (!empty($recommended)) : ?>
        <section class="mb-10">
            <h2 class="font-black text-xl text-telecareer-ink mb-4">あなたへのおすすめ求人</h2>
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <?php foreach ($recommended as $job) : ?>
                    <?php get_template_part('template-parts/job-card', null, array('job' => $job)); ?>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endif; ?>

    <!-- 雇用形態タブ -->
    <div class="flex flex-wrap gap-2 mb-5">
        <a href="<?php echo esc_url(engine_jobs_href($filters, array('jobType' => ''))); ?>" class="tag-pill <?php echo empty($filters['jobType']) ? 'tag-coral' : 'tag-plain'; ?>">すべて</a>
        <?php foreach (engine_job_type_options() as $jt) : ?>
            <a href="<?php echo esc_url(engine_jobs_href($filters, array('jobType' => $jt))); ?>" class="tag-pill <?php echo ($filters['jobType'] === $jt) ? 'tag-coral' : 'tag-plain'; ?>"><?php echo esc_html($jt); ?></a>
        <?php endforeach; ?>
    </div>

    <!-- 詳細絞り込み -->
    <form method="get" action="<?php echo esc_url(home_url('/jobs')); ?>" class="tc-card-soft p-5 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <?php if (!empty($filters['jobType'])) : ?>
            <input type="hidden" name="jobType" value="<?php echo esc_attr($filters['jobType']); ?>" />
        <?php endif; ?>
        <div>
            <label class="tc-label">キーワード</label>
            <input type="text" name="q" value="<?php echo esc_attr($filters['q']); ?>" class="tc-input" placeholder="職種・番組名など" />
        </div>
        <div>
            <label class="tc-label">職種</label>
            <select name="category" class="tc-input">
                <option value="">すべて</option>
                <?php foreach (engine_job_category_options() as $c) : ?>
                    <option value="<?php echo esc_attr($c); ?>"<?php selected($filters['category'], $c); ?>><?php echo esc_html($c); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="tc-label">エリア</label>
            <select name="area" class="tc-input">
                <option value="">すべて</option>
                <?php foreach (engine_area_options() as $a) : ?>
                    <option value="<?php echo esc_attr($a); ?>"<?php selected($filters['area'], $a); ?>><?php echo esc_html($a); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="tc-label">給与形態</label>
            <select name="payType" class="tc-input">
                <option value="">すべて</option>
                <?php foreach (engine_pay_type_options() as $p) : ?>
                    <option value="<?php echo esc_attr($p); ?>"<?php selected($filters['payType'], $p); ?>><?php echo esc_html($p); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="tc-label">時給</label>
            <select name="wageMin" class="tc-input">
                <?php foreach (engine_wage_min_options() as $w) : ?>
                    <option value="<?php echo esc_attr($w['value']); ?>"<?php selected($filters['wageMin'], $w['value']); ?>><?php echo esc_html($w['label']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="tc-label">並び替え</label>
            <select name="sort" class="tc-input">
                <?php foreach (engine_sort_options() as $s) : ?>
                    <option value="<?php echo esc_attr($s['value']); ?>"<?php selected($filters['sort'] ?: 'new', $s['value']); ?>><?php echo esc_html($s['label']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="flex items-end gap-2 sm:col-span-2">
            <button type="submit" class="btn-cta px-6 py-2.5 font-bold">絞り込む</button>
            <a href="<?php echo esc_url(home_url('/jobs')); ?>" class="btn-outline-coral px-4 py-2.5 font-bold">リセット</a>
        </div>
    </form>

    <p class="text-sm text-gray-500 mb-4"><?php echo count($jobs); ?> 件の求人</p>

    <?php if (empty($jobs)) : ?>
        <div class="tc-card p-8 text-center">
            <p class="font-bold text-telecareer-ink mb-1">条件に合う求人が見つかりませんでした</p>
            <p class="text-sm text-gray-600">条件を変えて、もう一度お試しください。</p>
        </div>
    <?php else : ?>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <?php foreach ($jobs as $job) : ?>
                <?php get_template_part('template-parts/job-card', null, array('job' => $job)); ?>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</main>
<?php
get_footer();
