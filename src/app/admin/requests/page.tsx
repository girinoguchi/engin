import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-auth";
import type { RequestRow } from "@/lib/types";
import { RequestStatusForm } from "./RequestStatusForm";

export default async function AdminRequestsPage() {
  if (isDemoMode()) {
    return (
      <div>
        <Link href="/admin" className="text-sm link-accent mb-4 inline-block">
          ← ダッシュボード
        </Link>
        <span className="tc-eyebrow bg-white">REQUESTS</span>
        <h1 className="mt-3 text-2xl md:text-3xl font-black text-telecareer-ink mb-2 tc-section-heading">
          依頼一覧
        </h1>
        <div className="tc-card-soft p-8 text-center mt-6 text-gray-600 text-sm">
          デモ環境では依頼データはありません。本番環境（Supabase 接続後）でご確認ください。
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("requests")
    .select(`
      id,
      created_at,
      talent_id,
      requester_company_name,
      requester_contact_name,
      requester_email,
      memo,
      status,
      talents(name)
    `)
    .order("created_at", { ascending: false });
  const list = (requests ?? []) as Array<
    Omit<RequestRow, "requester_user_id"> & { talents?: { name: string } | { name: string }[] | null }
  >;

  return (
    <div>
      <Link href="/admin" className="text-sm link-accent mb-4 inline-block">← ダッシュボード</Link>
      <span className="tc-eyebrow bg-white">REQUESTS</span>
      <h1 className="mt-3 text-2xl md:text-3xl font-black text-telecareer-ink mb-2 tc-section-heading">
        依頼一覧
      </h1>
      <div className="tc-card-soft overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-telecareer-yellow/15 border-b-2 border-ink/10">
              <tr>
                <th className="px-4 py-3 text-sm font-bold text-ink">依頼日時</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">依頼企業名</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">担当者名</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">メール</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">希望人材</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">メモ</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">対応状況</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-gray-500 text-center">依頼はまだありません</td></tr>
              ) : (
                list.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(r.created_at).toLocaleString("ja")}
                    </td>
                    <td className="px-4 py-3">{r.requester_company_name ?? "—"}</td>
                    <td className="px-4 py-3">{r.requester_contact_name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm">{r.requester_email ?? "—"}</td>
                    <td className="px-4 py-3">
                      {r.talents
                        ? Array.isArray(r.talents)
                          ? (r.talents[0] as { name: string } | undefined)?.name ?? "—"
                          : (r.talents as { name: string }).name
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-[200px] truncate">{r.memo ?? "—"}</td>
                    <td className="px-4 py-3">
                      <RequestStatusForm requestId={r.id} currentStatus={r.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
