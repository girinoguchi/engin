"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearLoggedOutFlag, demoAfterLoginPath, isLoggedOutFlagSet, saveClientSession, useDemoClientSession } from "@/lib/demo-client-session";

const AFTER_LOGIN_MEMBER = "/jobs";

export function DemoLoginForm({ errorCode }: { errorCode?: string }) {
  const { session, loading } = useDemoClientSession();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorCode === "badpass"
      ? "パスワードが正しくありません。"
      : errorCode === "notfound"
        ? "このメールアドレスは登録されていません。会員登録からお試しください。"
        : null
  );

  useEffect(() => {
    if (loading) return;
    if (isLoggedOutFlagSet()) return;
    if (session) {
      window.location.assign(demoAfterLoginPath(session.role));
    }
  }, [loading, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail) {
      setError("メールアドレスを入力してください。");
      return;
    }
    if (!trimmedPassword) {
      setError("パスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/demo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || "ログインに失敗しました。再度お試しください。");
        setSubmitting(false);
        return;
      }
      if (data.session) {
        clearLoggedOutFlag();
        saveClientSession(data.session);
        window.location.assign(demoAfterLoginPath(data.session.role));
      } else {
        window.location.assign(AFTER_LOGIN_MEMBER);
      }
    } catch {
      setError("通信に失敗しました。電波の良い場所で再度お試しください。");
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 tc-card p-6 md:p-7">
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
          <label className="tc-label">メールアドレス / ID</label>
          <input
            type="text"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="tc-input"
          />
        </div>
        <div>
          <label className="tc-label">パスワード</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
