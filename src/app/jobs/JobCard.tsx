import Link from "next/link";
import type { Job } from "@/lib/types";
import { categoryClass, formatDeadline, jobTypeClass } from "@/lib/wordpress/jobs";

export function JobCard({ job }: { job: Job }) {
  const deadline = formatDeadline(job.deadline);

  return (
    <Link href={`/jobs/${job.slug}`} className="tc-card tc-card-hover p-5 flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {job.job_type ? (
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${jobTypeClass(job.job_type)}`}>
            {job.job_type}
          </span>
        ) : null}
        <span className={`tag-pill ${categoryClass(job.category)}`}>{job.category}</span>
      </div>

      <h3 className="font-black text-lg text-telecareer-ink leading-snug">{job.title}</h3>

      <dl className="mt-3 space-y-1 text-sm text-gray-600">
        {job.location ? (
          <div className="flex gap-2">
            <dt className="text-gray-400 shrink-0">勤務地</dt>
            <dd className="font-semibold text-ink">{job.location}</dd>
          </div>
        ) : null}
        {job.pay ? (
          <div className="flex gap-2">
            <dt className="text-gray-400 shrink-0">報酬</dt>
            <dd className="font-semibold text-ink">{job.pay}</dd>
          </div>
        ) : null}
        {job.work_period ? (
          <div className="flex gap-2">
            <dt className="text-gray-400 shrink-0">期間</dt>
            <dd className="font-semibold text-ink">{job.work_period}</dd>
          </div>
        ) : null}
        {deadline ? (
          <div className="flex gap-2">
            <dt className="text-gray-400 shrink-0">締切</dt>
            <dd className="font-semibold text-ink">{deadline}</dd>
          </div>
        ) : null}
      </dl>

      {job.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag-pill tag-plain text-xs">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <span className="mt-auto pt-4 text-sm font-bold link-accent">詳細を見る →</span>
    </Link>
  );
}
