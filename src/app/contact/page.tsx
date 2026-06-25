import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
import { MypageContactForm } from "@/components/MypageContactForm";
import { getCurrentUser } from "@/lib/auth";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/mypage#contact");
  }

  const params = await searchParams;
  const sent = params.sent === "1";

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface overflow-x-hidden">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-14 flex-1 w-full min-w-0 tc-page-stagger">
        <span className="tc-eyebrow bg-white">CONTACT</span>
        <h1 className="mt-4 text-3xl font-black text-telecareer-ink mb-3">
          <span className="tc-marker">お問い合わせ</span>
        </h1>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          サービスやお仕事に関するご質問・ご相談はこちらから。未経験の方のキャリア相談も歓迎です。
          <br />
          担当のキャリアマネージャーより追ってご連絡いたします。
        </p>

        {sent ? (
          <div className="tc-card p-8 text-center">
            <p className="font-black text-telecareer-ink text-lg mb-1">お問い合わせを受け付けました</p>
            <p className="text-sm text-gray-600">内容を確認のうえ、担当者よりご連絡いたします。ありがとうございました。</p>
            <Link href="/" className="link-accent inline-block mt-4">
              トップへ戻る →
            </Link>
          </div>
        ) : (
          <div className="tc-card p-6 md:p-7">
            <MypageContactForm />
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          すでに会員の方は
          <Link href="/login" className="link-accent">
            ログイン
          </Link>
          してマイページからお問い合わせください。
        </p>
      </main>
      <Footer />
    </div>
  );
}
