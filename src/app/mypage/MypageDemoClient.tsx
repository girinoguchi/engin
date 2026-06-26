"use client";

import { useEffect } from "react";
import { MypageContactForm } from "@/components/MypageContactForm";
import { useDemoClientSession } from "@/lib/demo-client-session";

export function MypageDemoClient() {
  const { session, loading } = useDemoClientSession();

  const categories = session?.interested_categories ?? [];
  const hasCategories = categories.length > 0;

  useEffect(() => {
    if (loading) return;
    if (!session) {
      window.location.assign("/login");
    }
  }, [loading, session]);

  if (loading || !session) {
    return (
      <div className="tc-card p-8 text-center text-sm text-gray-500">読み込み中...</div>
    );
  }

  const name = session.contact_name?.trim() || "会員";

  return (
    <>
      <h1 className="mt-4 text-3xl font-black text-telecareer-ink mb-6">
        <span className="tc-marker">{name}</span> さんのマイページ
      </h1>

      <section className="tc-card p-6 md:p-7 mb-10">
        <h2 className="font-black text-lg text-telecareer-ink mb-4">登録情報</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">お名前</dt>
            <dd className="font-semibold text-ink">{name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">メールアドレス</dt>
            <dd className="font-semibold text-ink break-all">{session.email}</dd>
          </div>
          {session.user_type ? (
            <div>
              <dt className="text-sm text-gray-500">区分</dt>
              <dd className="font-semibold text-ink">{session.user_type}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-sm text-gray-500">興味のある職種</dt>
            <dd className="font-semibold text-ink">
              {hasCategories ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {categories.map((c) => (
                    <span key={c} className="tag-pill tag-plain text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-sm">未設定</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12" id="contact">
        <h2 className="font-black text-xl text-telecareer-ink mb-2">お問い合わせ</h2>
        <p className="text-sm text-gray-600 mb-4">
          サービスやお仕事に関するご質問・ご相談はこちらから。担当よりご連絡いたします。
        </p>
        <div className="tc-card p-6 md:p-7">
          <MypageContactForm
            defaultName={session.contact_name ?? ""}
            defaultEmail={session.email ?? ""}
            defaultPhone={session.phone ?? ""}
          />
        </div>
      </section>
    </>
  );
}
