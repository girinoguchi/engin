"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JOB_CATEGORY_OPTIONS, USER_TYPE_OPTIONS } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    contact_name: "",
    birthdate: "",
    phone: "",
    email: "",
    password: "",
    user_type: "" as string,
    interested_categories: [] as string[],
    newsletter_opt_in: true,
  });

  const toggleCategory = (c: string) => {
    setForm((prev) => ({
      ...prev,
      interested_categories: prev.interested_categories.includes(c)
        ? prev.interested_categories.filter((x) => x !== c)
        : [...prev.interested_categories, c],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 必須項目のバリデーション（空欄チェック）
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();
    if (!trimmedEmail) {
      setError("メールアドレスを入力してください。");
      return;
    }
    if (!trimmedPassword) {
      setError("パスワードを入力してください。");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }

    const useDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    setLoading(true);
    try {
      if (useDemo) {
        const res = await fetch("/api/demo/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
            contact_name: form.contact_name.trim() || null,
            birthdate: form.birthdate || null,
            phone: form.phone.trim() || null,
            user_type: form.user_type || null,
            interested_categories: form.interested_categories,
            newsletter_opt_in: form.newsletter_opt_in,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) || "登録に失敗しました。再度お試しください。");
          return;
        }
        router.push("/talents");
        router.refresh();
        return;
      }

      const supabase = createClient();
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: { emailRedirectTo: `${location.origin}/talents` },
      });
      if (signUpError) {
        setError(signUpError.message + " 内容を修正して再度送信してください。");
        return;
      }
      if (!authData.user) {
        setError("登録に失敗しました。再度お試しください。");
        return;
      }
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        company_name: null,
        contact_name: form.contact_name.trim() || null,
        email: trimmedEmail,
        role: "member",
        program_genres: [],
        needed_roles: [],
        interested_categories: form.interested_categories,
        birthdate: form.birthdate || null,
        phone: form.phone.trim() || null,
        user_type: form.user_type || null,
        newsletter_opt_in: form.newsletter_opt_in,
      });
      if (profileError) {
        setError(profileError.message + " 内容を修正して再度送信してください。");
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
        <span className="tc-eyebrow bg-white">SIGN UP</span>
        <h1 className="mt-4 text-3xl font-black text-telecareer-ink mb-6">
          <span className="tc-marker">会員登録</span>
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
            <label className="tc-label">お名前 *</label>
            <input
              type="text"
              required
              value={form.contact_name}
              onChange={(e) => setForm((p) => ({ ...p, contact_name: e.target.value }))}
              className="tc-input"
              placeholder="例: 山田 太郎"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="tc-label">生年月日</label>
              <input
                type="date"
                value={form.birthdate}
                onChange={(e) => setForm((p) => ({ ...p, birthdate: e.target.value }))}
                className="tc-input"
              />
            </div>
            <div>
              <label className="tc-label">電話番号</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="tc-input"
                placeholder="例: 090-1234-5678"
              />
            </div>
          </div>
          <div>
            <label className="tc-label">メールアドレス *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="tc-input"
            />
          </div>
          <div>
            <label className="tc-label">パスワード *</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="tc-input"
              placeholder="6文字以上"
            />
          </div>
          <div>
            <label className="tc-label mb-2">あてはまるものを選択してください</label>
            <div className="flex flex-wrap gap-2">
              {USER_TYPE_OPTIONS.map((t) => {
                const on = form.user_type === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm((p) => ({ ...p, user_type: on ? "" : t }))}
                    className={`tag-pill cursor-pointer transition-colors ${on ? "tag-green" : "tag-plain"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="tc-label mb-1">どんな案件をお探しですか？（任意・複数可）</label>
            <p className="text-xs text-gray-500 mb-2">選んでおくと、ログイン後におすすめの求人をご案内します。</p>
            <div className="flex flex-wrap gap-2">
              {JOB_CATEGORY_OPTIONS.map((c) => {
                const on = form.interested_categories.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCategory(c)}
                    className={`tag-pill cursor-pointer transition-colors ${on ? "tag-orange" : "tag-plain"}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-ink/15 pt-4 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newsletter_opt_in}
                onChange={(e) => setForm((p) => ({ ...p, newsletter_opt_in: e.target.checked }))}
                className="w-4 h-4 mt-0.5 accent-telecareer-orange shrink-0"
              />
              <span className="text-sm text-gray-700">今後、案件や求人情報などのお知らせを受け取る（不要な場合はチェックを外してください）</span>
            </label>
            <p className="text-xs text-gray-500 leading-relaxed">
              ご登録後、担当のキャリアマネージャーよりご連絡を差し上げる場合があります。<br />
              ご登録をもって<Link href="/privacy" className="link-accent">プライバシーポリシー</Link>に同意したものとみなします。
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cta py-3 font-bold disabled:opacity-50"
          >
            {loading ? "登録中..." : "会員登録"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-600">
          <Link href="/login" className="link-accent">すでにアカウントをお持ちの方はログイン →</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
