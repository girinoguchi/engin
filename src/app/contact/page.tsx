import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 flex-1 w-full text-center">
        <span className="tc-eyebrow bg-white">CONTACT</span>
        <h1 className="mt-4 text-3xl font-black text-telecareer-ink mb-4">
          <span className="tc-marker">お問い合わせ</span>
        </h1>
        <p className="text-gray-600 mb-8">
          ご相談・ご質問は会員登録後、担当キャリアアドバイザーよりご連絡いたします。
        </p>
        <Link href="/signup" className="btn-cta px-8 py-3.5 font-bold inline-block">
          無料で会員登録 →
        </Link>
      </main>
      <Footer />
    </div>
  );
}
