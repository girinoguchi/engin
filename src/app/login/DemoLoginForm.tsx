"use client";

import { useState } from "react";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  empty: "メールアドレスとパスワードを入力してください。",
  notfound: "このメールアドレスは登録されていません。会員登録からお試しください。",
  badpass: "パスワードが正しくありません。",
};

export function DemoLoginForm({
  redirectTo,
  errorCode,
}: {
  redirectTo: string;
  errorCode?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const initialError = errorCode ? ERROR_MESSAGES[errorCode] ?? null : null;
  const [error, setError] = useState<string | null>(initialError);

  return (
    <>
      <form
        method="POST"
        action="/api/demo/login-form"
        className="space-y-4 tc-card p-6 md:p-7"
        onSubmit={() => setSubmitting(true)}
      >
        <input type="hidden" name="redirect" value={redirectTo} />
        {error && (
          <div className="tc-error-enter text-coral-a11y text-sm bg-telecareer-coral/10 p-4 rounded-xl border-2 border-telecareer-coral flex justify-between items-start gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-telecareer-coral hover:opacity-70 shrink-0 font-bold"
              aria-label="エラーを閉じる"
            >
              ×
            </button>
          </div>
        )}
        <div>
          <label className="tc-label">メールアドレス</label>
          <input type="email" name="email" required autoComplete="email" className="tc-input" />
        </div>
        <div>
          <label className="tc-label">パスワード</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="tc-input"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full btn-cta py-3 font-bold disabled:opacity-50${submitting ? " tc-btn-loading" : ""}`}
        >
          {submitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-600">
        <Link href="/signup" className="link-accent">
          会員登録はこちら →
        </Link>
      </p>
    </>
  );
}
