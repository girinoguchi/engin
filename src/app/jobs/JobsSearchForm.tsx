"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  JOB_AREA_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  JOB_SORT_OPTIONS,
  JOB_TYPE_OPTIONS,
  PAY_TYPE_OPTIONS,
} from "@/lib/types";
import type { JobFilters } from "@/lib/types";

const inputSm =
  "w-full min-w-0 box-border bg-white border-2 border-ink rounded-lg px-2.5 py-1.5 text-sm transition-[box-shadow,border-color] focus:outline-none focus:border-telecareer-orange focus:shadow-[0_0_0_2px_rgba(245,124,32,0.2)]";

export function JobsSearchForm({ filters }: { filters: JobFilters }) {
  const router = useRouter();

  const buildHref = (patch: Partial<JobFilters>) => {
    const next: JobFilters = { ...filters, ...patch };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.jobType) params.set("jobType", next.jobType);
    if (next.area) params.set("area", next.area);
    if (next.payType) params.set("payType", next.payType);
    if (next.sort && next.sort !== "new") params.set("sort", next.sort);
    const query = params.toString();
    return query ? `/jobs?${query}` : "/jobs";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const q = (form.querySelector('[name="q"]') as HTMLInputElement)?.value ?? "";
    const category = (form.querySelector('[name="category"]') as HTMLSelectElement)?.value ?? "";
    const area = (form.querySelector('[name="area"]') as HTMLSelectElement)?.value ?? "";
    const payType = (form.querySelector('[name="payType"]') as HTMLSelectElement)?.value ?? "";
    const sort = (form.querySelector('[name="sort"]') as HTMLSelectElement)?.value ?? "new";

    const params = new URLSearchParams();
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (area) params.set("area", area);
    if (payType) params.set("payType", payType);
    if (sort && sort !== "new") params.set("sort", sort);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      {/* 雇用形態タブ */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Link
          href={buildHref({ jobType: "" })}
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold border-2 border-ink transition-colors ${
            !filters.jobType ? "bg-telecareer-coral text-white" : "bg-white text-ink hover:bg-gray-50"
          }`}
        >
          すべて
        </Link>
        {JOB_TYPE_OPTIONS.map((jobType) => (
          <Link
            key={jobType}
            href={buildHref({ jobType })}
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold border-2 border-ink transition-colors ${
              filters.jobType === jobType ? "bg-telecareer-coral text-white" : "bg-white text-ink hover:bg-gray-50"
            }`}
          >
            {jobType}
          </Link>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="tc-card-soft p-3 sm:p-4 space-y-2.5"
      >
        {/* メイン行: キーワード + 主要フィルタ + 検索 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_9rem_9rem_auto] gap-2 items-end">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="sr-only" htmlFor="jobs-q">
              キーワード
            </label>
            <input
              id="jobs-q"
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              className={inputSm}
              placeholder="キーワード（職種・番組名など）"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="jobs-category">
              職種
            </label>
            <select id="jobs-category" name="category" defaultValue={filters.category ?? ""} className={inputSm}>
              <option value="">職種：すべて</option>
              {JOB_CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="jobs-area">
              エリア
            </label>
            <select id="jobs-area" name="area" defaultValue={filters.area ?? ""} className={inputSm}>
              <option value="">エリア：すべて</option>
              {JOB_AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-cta px-4 py-1.5 text-sm font-bold whitespace-nowrap w-full sm:w-auto">
            絞り込む
          </button>
        </div>

        {/* サブ行: 給与・並び・リセット */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5 border-t border-ink/10">
          <select name="payType" defaultValue={filters.payType ?? ""} className={`${inputSm} w-auto min-w-[7.5rem] flex-1 sm:flex-none`}>
            <option value="">給与形態</option>
            {PAY_TYPE_OPTIONS.filter(Boolean).map((payType) => (
              <option key={payType} value={payType}>
                {payType}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={filters.sort || "new"} className={`${inputSm} w-auto min-w-[6.5rem] flex-1 sm:flex-none`}>
            {JOB_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Link
            href="/jobs"
            className="text-xs font-bold text-gray-500 hover:text-telecareer-coral whitespace-nowrap ml-auto"
          >
            リセット
          </Link>
        </div>
      </form>
    </div>
  );
}
