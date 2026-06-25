"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  JOB_AREA_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  JOB_SORT_OPTIONS,
  JOB_TYPE_OPTIONS,
  JOB_WAGE_MIN_OPTIONS,
  PAY_TYPE_OPTIONS,
} from "@/lib/types";
import type { JobFilters } from "@/lib/types";

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
    if (next.wageMin) params.set("wageMin", next.wageMin);
    if (next.inexperienced) params.set("inexperienced", next.inexperienced);
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
    const wageMin = (form.querySelector('[name="wageMin"]') as HTMLSelectElement)?.value ?? "";
    const sort = (form.querySelector('[name="sort"]') as HTMLSelectElement)?.value ?? "new";
    const inexperienced = (form.querySelector('[name="inexperienced"]') as HTMLInputElement)?.checked
      ? "1"
      : "";

    const params = new URLSearchParams();
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (area) params.set("area", area);
    if (payType) params.set("payType", payType);
    if (wageMin) params.set("wageMin", wageMin);
    if (inexperienced) params.set("inexperienced", inexperienced);
    if (sort && sort !== "new") params.set("sort", sort);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5">
        <Link
          href={buildHref({ jobType: "" })}
          className={`tag-pill ${!filters.jobType ? "tag-coral" : "tag-plain"}`}
        >
          すべて
        </Link>
        {JOB_TYPE_OPTIONS.map((jobType) => (
          <Link
            key={jobType}
            href={buildHref({ jobType })}
            className={`tag-pill ${filters.jobType === jobType ? "tag-coral" : "tag-plain"}`}
          >
            {jobType}
          </Link>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="tc-card-soft p-5 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="tc-label">キーワード</label>
          <input
            type="text"
            name="q"
            defaultValue={filters.q ?? ""}
            className="tc-input"
            placeholder="職種・番組名など"
          />
        </div>
        <div>
          <label className="tc-label">職種</label>
          <select name="category" defaultValue={filters.category ?? ""} className="tc-input">
            <option value="">すべて</option>
            {JOB_CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="tc-label">エリア</label>
          <select name="area" defaultValue={filters.area ?? ""} className="tc-input">
            <option value="">すべて</option>
            {JOB_AREA_OPTIONS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="tc-label">給与形態</label>
          <select name="payType" defaultValue={filters.payType ?? ""} className="tc-input">
            <option value="">すべて</option>
            {PAY_TYPE_OPTIONS.filter(Boolean).map((payType) => (
              <option key={payType} value={payType}>
                {payType}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="tc-label">時給</label>
          <select name="wageMin" defaultValue={filters.wageMin ?? ""} className="tc-input">
            {JOB_WAGE_MIN_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="tc-label">並び替え</label>
          <select name="sort" defaultValue={filters.sort || "new"} className="tc-input">
            {JOB_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-telecareer-ink">
            <input
              type="checkbox"
              name="inexperienced"
              defaultChecked={filters.inexperienced === "1"}
              className="w-4 h-4 accent-telecareer-orange"
            />
            未経験OKのみ
          </label>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-cta px-6 py-2.5 font-bold">
            絞り込む
          </button>
          <Link href="/jobs" className="btn-outline-coral px-4 py-2.5 font-bold">
            リセット
          </Link>
        </div>
      </form>
    </>
  );
}
