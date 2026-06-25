import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import {
  categoryClass,
  formatDeadline,
  getJobBySlug,
  getJobs,
  jobTypeClass,
} from "@/lib/wordpress/jobs";

export const revalidate = 60;

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.filter((job) => job.is_active).map((job) => ({ slug: job.slug }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) {
    notFound();
  }

  const user = await getCurrentUser();
  const deadline = formatDeadline(job.deadline);

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <Header user={user ?? undefined} />
      <main className="mx-auto max-w-3xl px-4 py-8 flex-1 tc-page-stagger">
        <Link href="/jobs" className="text-sm link-accent mb-5 inline-block">
          ← 案件一覧へ
        </Link>

        <article className="tc-card p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {job.job_type ? (
              <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${jobTypeClass(job.job_type)}`}>
                {job.job_type}
              </span>
            ) : null}
            <span className={`tag-pill ${categoryClass(job.category)}`}>{job.category}</span>
          </div>

          <h1 className="mt-3 text-2xl md:text-3xl font-black text-telecareer-ink">{job.title}</h1>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {job.location ? (
              <div>
                <dt className="text-sm text-gray-500">勤務地</dt>
                <dd className="font-semibold text-ink">{job.location}</dd>
              </div>
            ) : null}
            {job.pay ? (
              <div>
                <dt className="text-sm text-gray-500">報酬・給与</dt>
                <dd className="font-semibold text-ink">{job.pay}</dd>
              </div>
            ) : null}
            {job.work_period ? (
              <div>
                <dt className="text-sm text-gray-500">期間・雇用形態</dt>
                <dd className="font-semibold text-ink">{job.work_period}</dd>
              </div>
            ) : null}
            {job.headcount != null ? (
              <div>
                <dt className="text-sm text-gray-500">募集人数</dt>
                <dd className="font-semibold text-ink">{job.headcount}名</dd>
              </div>
            ) : null}
            {deadline ? (
              <div>
                <dt className="text-sm text-gray-500">応募締切</dt>
                <dd className="font-semibold text-ink">{deadline}</dd>
              </div>
            ) : null}
          </dl>

          {job.body ? (
            <div className="mt-6 border-t-2 border-dashed border-ink/15 pt-6">
              <h2 className="text-sm text-gray-500 mb-2">募集内容</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-ink">{job.body}</p>
            </div>
          ) : null}

          {job.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span key={tag} className="tag-pill tag-plain">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-8 border-t-2 border-dashed border-ink/15 pt-6">
            {user ? (
              <p className="text-sm text-gray-700">
                応募機能は準備中です。担当者へお問い合わせください。
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                応募するには
                <Link href="/login" className="link-accent mx-1">
                  ログイン
                </Link>
                または
                <Link href="/signup" className="link-accent mx-1">
                  会員登録
                </Link>
                してください。
              </p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
