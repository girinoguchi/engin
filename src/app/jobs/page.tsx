import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-auth";
import { getFilteredJobs, getRecommendedJobs } from "@/lib/wordpress/jobs";
import type { JobFilters } from "@/lib/types";
import { JobCard } from "./JobCard";
import { JobsSearchForm } from "./JobsSearchForm";
import { JobsMemberOnly } from "./JobsMemberOnly";

export const dynamic = "force-dynamic";

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
    sort: typeof params.sort === "string" ? params.sort : "new",
  };

  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  if (!isDemoMode() && profile?.role === "admin") {
    redirect("/admin");
  }
  const jobs = await getFilteredJobs(filters);
  const recommended = user ? await getRecommendedJobs(profile?.interested_categories ?? [], 3) : [];

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full tc-page-stagger">
        <JobsMemberOnly>
        <div className="mb-8">
          <span className="tc-eyebrow bg-white">JOBS</span>
          <h1 className="mt-4 text-3xl font-black text-telecareer-ink">
            <span className="tc-marker">求人を探す</span>
          </h1>
        </div>

        {recommended.length > 0 ? (
          <section className="mb-10">
            <h2 className="font-black text-xl text-telecareer-ink mb-4">あなたへのおすすめ求人</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        ) : null}

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
        </JobsMemberOnly>
      </main>
      <Footer />
    </div>
  );
}
