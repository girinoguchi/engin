import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getWordPressApiUrl } from "@/lib/wordpress/config";
import { getFilteredJobs } from "@/lib/wordpress/jobs";
import type { JobFilters } from "@/lib/types";
import { JobCard } from "./JobCard";
import { JobsSearchForm } from "./JobsSearchForm";

export const revalidate = 60;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: JobFilters = {
    q: typeof params.q === "string" ? params.q : "",
    category: typeof params.category === "string" ? params.category : "",
    jobType: typeof params.jobType === "string" ? params.jobType : "",
    area: typeof params.area === "string" ? params.area : "",
    payType: typeof params.payType === "string" ? params.payType : "",
    wageMin: typeof params.wageMin === "string" ? params.wageMin : "",
    inexperienced: typeof params.inexperienced === "string" ? params.inexperienced : "",
    sort: typeof params.sort === "string" ? params.sort : "new",
  };

  const jobs = await getFilteredJobs(filters);
  const usingWordPress = Boolean(getWordPressApiUrl());

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full tc-page-stagger">
        <div className="mb-8">
          <span className="tc-eyebrow bg-white">JOBS</span>
          <h1 className="mt-4 text-3xl font-black text-telecareer-ink">
            <span className="tc-marker">求人を探す</span>
          </h1>
          <p className="mt-3 text-gray-600 text-sm">
            エンタメ業界の求人を、雇用形態・職種・エリア・時給などで絞り込めます。
            {usingWordPress ? " WordPress の更新は最大1分以内に反映されます。" : " デモデータを表示中です。"}
          </p>
        </div>

        <JobsSearchForm filters={filters} />

        <p className="text-sm text-gray-500 mb-4">{jobs.length} 件の求人</p>

        {jobs.length === 0 ? (
          <div className="tc-card p-8 text-center">
            <p className="font-bold text-telecareer-ink mb-1">条件に合う求人が見つかりませんでした</p>
            <p className="text-sm text-gray-600">条件を変えて、もう一度お試しください。</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
