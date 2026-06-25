"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    const useDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    setLoading(true);
    try {
      if (useDemo) {
        const res = await fetch("/api/demo/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) || "ログインに失敗しました。再度お試しください。");
          return;
        }
        router.push("/talents");
        router.refresh();
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      if (signInError) {
        setError(signInError.message + " 内容を修正して再度送信してください。");
        return;
      }
      router.push("/talents");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました。内容を確認して再度送信してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 flex-1 w-full">
        <span className="tc-eyebrow bg-white">LOGIN</span>
        <h1 className="mt-4 text-3xl font-black text-telecareer-ink mb-6">
          <span className="tc-marker">ログイン</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 tc-card p-6 md:p-7">
          {error && (
            <div className="text-coral-a11y text-sm bg-telecareer-coral/10 p-4 rounded-xl border-2 border-telecareer-coral flex justify-between items-start gap-3">
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
            <input
              type="email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tc-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cta py-3 font-bold disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-600">
          <Link href="/signup" className="link-accent">会員登録はこちら →</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
