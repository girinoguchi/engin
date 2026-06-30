import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-auth";
import { AdminJobsManager } from "@/components/admin/AdminJobsManager";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  if (!isDemoMode()) {
    const profile = await requireAdmin();
    if (!profile) redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div>
          <Link href="/admin" className="text-sm link-accent mb-4 inline-block">
            ← ダッシュボード
          </Link>
          <div className="tc-card-soft p-8 text-center text-sm text-gray-500">読み込み中...</div>
        </div>
      }
    >
      <AdminJobsManager />
    </Suspense>
  );
}
