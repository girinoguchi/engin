"use client";

import { useState } from "react";
import {
  JOB_CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  PAY_TYPE_OPTIONS,
  type Job,
} from "@/lib/types";
import { adminFetchJson } from "@/lib/demo-admin-client";
import { adminJobsApiBase } from "@/lib/admin-api-paths";
import { AdminModalShell } from "./AdminModalShell";

type FormState = {
  title: string;
  category: string;
  job_type: string;
  location: string;
  pay: string;
  pay_type: string;
  wage_min: string;
  work_period: string;
  headcount: string;
  deadline: string;
  tags: string;
  body: string;
  is_active: boolean;
};

function toForm(job: Job | null): FormState {
  return {
    title: job?.title ?? "",
    category: job?.category ?? "制作・AD",
    job_type: job?.job_type ?? "単発",
    location: job?.location ?? "",
    pay: job?.pay ?? "",
    pay_type: job?.pay_type ?? "",
    wage_min: job?.wage_min != null ? String(job.wage_min) : "",
    work_period: job?.work_period ?? "",
    headcount: job?.headcount != null ? String(job.headcount) : "",
    deadline: job?.deadline ?? "",
    tags: job?.tags?.join(" ") ?? "",
    body: job?.body ?? "",
    is_active: job?.is_active ?? true,
  };
}

export function JobFormModal({
  job,
  onClose,
  onSaved,
}: {
  job: Job | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(job);
  const [form, setForm] = useState<FormState>(toForm(job));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("求人タイトルは必須です");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      wage_min: form.wage_min.trim() === "" ? null : form.wage_min,
      headcount: form.headcount.trim() === "" ? null : form.headcount,
    };
    const base = adminJobsApiBase();
    const url = isEdit ? `${base}/${job!.id}` : base;
    const method = isEdit ? "PUT" : "POST";
    const { ok, data } = await adminFetchJson<{ error?: string }>(url, {
      method,
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!ok) {
      setError(data.error ?? "保存に失敗しました");
      return;
    }
    onSaved();
  };

  return (
    <AdminModalShell
      title={isEdit ? "求人を編集" : "求人を新規登録"}
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline-coral px-7 py-2.5 font-bold w-full sm:w-auto"
          >
            キャンセル
          </button>
          <button
            type="submit"
            form="admin-job-form"
            disabled={saving}
            className="btn-cta px-7 py-2.5 font-bold disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? "保存中..." : isEdit ? "更新する" : "登録する"}
          </button>
        </div>
      }
    >
      {error ? (
        <div className="text-coral-a11y bg-telecareer-coral/10 border-2 border-telecareer-coral p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      ) : null}

      <form id="admin-job-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="tc-label">求人タイトル *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="tc-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="tc-label">カテゴリ</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="tc-input"
              >
                {JOB_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tc-label">雇用形態</label>
              <select
                value={form.job_type}
                onChange={(e) => set("job_type", e.target.value)}
                className="tc-input"
              >
                {JOB_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="tc-label">勤務地</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="tc-input"
              />
            </div>
            <div>
              <label className="tc-label">募集人数</label>
              <input
                type="number"
                min={0}
                value={form.headcount}
                onChange={(e) => set("headcount", e.target.value)}
                className="tc-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="tc-label">報酬・給与（表示用）</label>
              <input
                type="text"
                value={form.pay}
                onChange={(e) => set("pay", e.target.value)}
                className="tc-input"
              />
            </div>
            <div>
              <label className="tc-label">給与区分</label>
              <select
                value={form.pay_type}
                onChange={(e) => set("pay_type", e.target.value)}
                className="tc-input"
              >
                {PAY_TYPE_OPTIONS.map((t) => (
                  <option key={t || "none"} value={t}>
                    {t || "指定なし"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="tc-label">最低時給（数値・任意）</label>
              <input
                type="number"
                min={0}
                value={form.wage_min}
                onChange={(e) => set("wage_min", e.target.value)}
                className="tc-input"
              />
            </div>
            <div>
              <label className="tc-label">期間・雇用形態（表示用）</label>
              <input
                type="text"
                value={form.work_period}
                onChange={(e) => set("work_period", e.target.value)}
                className="tc-input"
              />
            </div>
            <div>
              <label className="tc-label">応募締切</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                className="tc-input"
              />
            </div>
          </div>

          <div>
            <label className="tc-label">タグ（スペース区切り）</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className="tc-input"
            />
          </div>

          <div>
            <label className="tc-label">募集内容</label>
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              rows={6}
              className="tc-input"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-telecareer-orange"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
              />
              <span className="text-sm font-semibold text-ink">
                公開する（オフにすると求人一覧に表示されません）
              </span>
            </label>
          </div>
      </form>
    </AdminModalShell>
  );
}
