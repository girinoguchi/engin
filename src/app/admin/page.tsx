import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-auth";
import { AdminDemoDashboard } from "@/components/admin/AdminDemoDashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isDemoMode()) {
    const profile = await requireAdmin();
    if (!profile) redirect("/login");
  }

  return <AdminDemoDashboard />;
}
