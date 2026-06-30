import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-auth";
import { AdminAccountsManager } from "@/components/admin/AdminAccountsManager";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  if (!isDemoMode()) {
    const profile = await requireAdmin();
    if (!profile) redirect("/login");
    return <AdminAccountsManager currentEmail={profile.email ?? undefined} />;
  }

  return <AdminAccountsManager />;
}
