"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Job } from "@/lib/types";
import { categoryClass } from "@/lib/wordpress/job-format";
import { adminFetchJson } from "@/lib/demo-admin-client";
import { adminJobsApiBase } from "@/lib/admin-api-paths";
import { JobFormModal } from "./JobFormModal";

export function AdminJobsManager() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await adminFetchJson<{ jobs?: Job[]; error?: string }>(
      adminJobsApiBase()
    );
    if (!ok) {
      setError(data.error ?? "求人の取得に失敗しました");
      setJobs([]);
    } else {
      setError(null);
      setJobs(data.jobs ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setCreating(true);
    }
  }, [searchParams]);

  const handleDelete = async (job: Job) => {
    if (!window.confirm(`「${job.title}」を削除します。よろしいですか？`)) return;
    setDeletingId(job.id);
    const { ok, data } = await adminFetchJson<{ error?: string }>(
      `${adminJobsApiBase()}/${job.id}`,
      { method: "DELETE" }
    );
    setDeletingId(null);
    if (!ok) {
      window.alert(data.error ?? "削除に失敗しました");
      return;
    }
    await load();
  };

  const handleSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  return (
    <div>
      <Link href="/admin" className="text-sm link-accent mb-4 inline-block">
        ← ダッシュボード
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
        <div>
          <span className="tc-eyebrow bg-white">JOBS</span>
          <h1 className="mt-3 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading">
            案件管理
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="btn-cta px-5 py-2.5 font-bold"
        >
          + 求人を新規登録
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        登録済みの求人一覧です。各行のボタンから編集・削除ができます。
      </p>

      {error ? (
        <div className="text-coral-a11y bg-telecareer-coral/10 border-2 border-telecareer-coral p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      ) : null}

      <div className="tc-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[680px]">
            <thead className="bg-telecareer-yellow/15 border-b-2 border-ink/10">
              <tr>
                <th className="px-4 py-3 text-sm font-bold text-ink">求人タイトル</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">カテゴリ</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">勤務地</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">状態</th>
                <th className="px-4 py-3 text-sm font-bold text-ink text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500 text-sm">
                    読み込み中...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500 text-sm">
                    求人がまだ登録されていません。「+ 求人を新規登録」から追加してください。
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-ink/5 align-middle">
                    <td className="px-4 py-3 font-bold text-ink max-w-[260px]">
                      <span className="block truncate">{job.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`tag-pill ${categoryClass(job.category)}`}>
                        {job.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`tag-pill ${job.is_active ? "tag-green" : "tag-plain"}`}>
                        {job.is_active ? "公開" : "非公開"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-ink/15 text-gray-600 hover:bg-ink/5 whitespace-nowrap"
                        >
                          表示
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditing(job)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-telecareer-orange text-telecareer-orange hover:bg-telecareer-orange/10 whitespace-nowrap"
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === job.id}
                          onClick={() => handleDelete(job)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-telecareer-coral text-coral-a11y hover:bg-telecareer-coral/10 whitespace-nowrap disabled:opacity-50"
                        >
                          {deletingId === job.id ? "削除中..." : "削除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {creating ? (
        <JobFormModal job={null} onClose={() => setCreating(false)} onSaved={handleSaved} />
      ) : null}
      {editing ? (
        <JobFormModal job={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      ) : null}
    </div>
  );
}
