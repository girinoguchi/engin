import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
import { MypageContactForm } from "@/components/MypageContactForm";
import { MypageDemoClient } from "./MypageDemoClient";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-auth";

export default async function Mypage() {
  // デモモードは Cookie をブロックするブラウザ(iOS Brave等)に対応するため
  // localStorage のセッションをクライアント側で読んで表示する。
  if (isDemoMode()) {
    return (
      <div className="min-h-screen flex flex-col bg-telecareer-surface overflow-x-hidden">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full min-w-0 tc-page-stagger">
          <span className="tc-eyebrow bg-white">MY PAGE</span>
          <MypageDemoClient />
        </main>
        <Footer />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();
  const name = profile?.contact_name?.trim() || "会員";
  const categories = profile?.interested_categories ?? [];
  const hasCategories = categories.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface overflow-x-hidden">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full min-w-0 tc-page-stagger">
        <span className="tc-eyebrow bg-white">MY PAGE</span>
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
              <dd className="font-semibold text-ink break-all">{profile?.email ?? user.email}</dd>
            </div>
            {profile?.user_type ? (
              <div>
                <dt className="text-sm text-gray-500">区分</dt>
                <dd className="font-semibold text-ink">{profile.user_type}</dd>
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

        <section id="contact">
          <h2 className="font-black text-xl text-telecareer-ink mb-2">お問い合わせ</h2>
          <p className="text-sm text-gray-600 mb-4">
            サービスやお仕事に関するご質問・ご相談はこちらから。担当よりご連絡いたします。
          </p>
          <div className="tc-card p-6 md:p-7">
            <MypageContactForm
              defaultName={profile?.contact_name ?? ""}
              defaultEmail={profile?.email ?? user.email ?? ""}
              defaultPhone={profile?.phone ?? ""}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
