"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetchJson } from "@/lib/demo-admin-client";
import { adminJobsApiBase, adminUsersApiBase } from "@/lib/admin-api-paths";

type Counts = { jobs: number; activeJobs: number; users: number; admins: number };

export function AdminDemoDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [jobsRes, usersRes] = await Promise.all([
        adminFetchJson<{ jobs?: { is_active: boolean }[] }>(adminJobsApiBase()),
        adminFetchJson<{ users?: { role: string }[] }>(adminUsersApiBase()),
      ]);
      if (!active) return;
      const jobs = jobsRes.data.jobs ?? [];
      const users = usersRes.data.users ?? [];
      setCounts({
        jobs: jobs.length,
        activeJobs: jobs.filter((j) => j.is_active).length,
        users: users.length,
        admins: users.filter((u) => u.role === "admin").length,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <span className="tc-eyebrow bg-white">ADMIN</span>
      <h1 className="mt-3 text-2xl md:text-3xl font-black text-telecareer-ink mb-2 tc-section-heading">
        管理者ダッシュボード
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        求人案件とアカウントの管理が行えます。下のメニューから操作を選んでください。
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard label="登録済みの求人" value={counts?.jobs} suffix="件" />
        <StatCard label="公開中の求人" value={counts?.activeJobs} suffix="件" tone="green" />
        <StatCard label="アカウント数" value={counts?.users} suffix="件" />
        <StatCard label="管理者" value={counts?.admins} suffix="名" tone="orange" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <NavCard
          href="/admin/jobs"
          title="案件管理"
          desc="求人の新規登録・内容の編集・削除ができます。"
          actionLabel="案件を管理する"
        />
        <NavCard
          href="/admin/accounts"
          title="アカウント管理"
          desc="会員・管理者アカウントの一覧確認・権限変更・削除ができます。"
          actionLabel="アカウントを管理する"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/jobs?new=1" className="btn-cta px-5 py-2.5 font-bold">
          + 求人を新規登録
        </Link>
        <Link href="/admin/jobs" className="btn-outline-coral px-5 py-2.5 font-bold">
          案件管理を見る
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  tone = "plain",
}: {
  label: string;
  value: number | undefined;
  suffix?: string;
  tone?: "plain" | "green" | "orange";
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-600"
      : tone === "orange"
        ? "text-telecareer-orange"
        : "text-telecareer-ink";
  return (
    <div className="tc-card-soft p-5">
      <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-black ${toneClass}`}>
        {value == null ? "—" : value}
        {value != null && suffix ? (
          <span className="text-base font-bold text-gray-400 ml-1">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

function NavCard({
  href,
  title,
  desc,
  actionLabel,
}: {
  href: string;
  title: string;
  desc: string;
  actionLabel: string;
}) {
  return (
    <Link
      href={href}
      className="tc-card p-6 md:p-7 block hover:-translate-y-0.5 transition-transform group"
    >
      <h2 className="text-xl font-black text-telecareer-ink mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed">{desc}</p>
      <span className="inline-flex items-center gap-1 font-bold text-telecareer-orange group-hover:gap-2 transition-all">
        {actionLabel}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
