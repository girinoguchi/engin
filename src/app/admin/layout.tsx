import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDemoMode()) {
    return (
      <div className="min-h-screen flex flex-col bg-telecareer-surface">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-14 flex-1 text-center">
          <h1 className="text-2xl font-black text-telecareer-ink mb-4">管理画面（デモ未対応）</h1>
          <p className="text-gray-600 mb-8">
            管理者ダッシュボードは Supabase 接続後の本番環境でご利用いただけます。
          </p>
          <Link href="/talents" className="btn-cta px-6 py-3 font-bold inline-block">
            人材名簿を見る →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = await requireAdmin();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <Header user={{ email: profile.email ?? undefined }} profile={profile} />
      <main className="mx-auto max-w-6xl px-4 py-6 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
