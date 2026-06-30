"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetchJson } from "@/lib/demo-admin-client";
import { adminUsersApiBase, isClientDemoMode } from "@/lib/admin-api-paths";
import { useDemoClientSession } from "@/lib/demo-client-session";
import { AccountFormModal, type AdminUser } from "./AccountFormModal";

export function AdminAccountsManager({ currentEmail }: { currentEmail?: string }) {
  const { session } = useDemoClientSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await adminFetchJson<{ users?: AdminUser[]; error?: string }>(
      adminUsersApiBase()
    );
    if (!ok) {
      setError(data.error ?? "アカウントの取得に失敗しました");
      setUsers([]);
    } else {
      setError(null);
      setUsers(data.users ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`「${user.email}」のアカウントを削除します。よろしいですか？`)) return;
    setDeletingEmail(user.email);
    const { ok, data } = await adminFetchJson<{ error?: string }>(adminUsersApiBase(), {
      method: "DELETE",
      body: JSON.stringify({ email: user.email }),
    });
    setDeletingEmail(null);
    if (!ok) {
      window.alert(data.error ?? "削除に失敗しました");
      return;
    }
    await load();
  };

  const handleSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  const currentEmailResolved =
    currentEmail?.toLowerCase() ??
    (isClientDemoMode() ? session?.email?.toLowerCase() : undefined);

  return (
    <div>
      <Link href="/admin" className="text-sm link-accent mb-4 inline-block">
        ← ダッシュボード
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
        <div>
          <span className="tc-eyebrow bg-white">ACCOUNTS</span>
          <h1 className="mt-3 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading">
            アカウント管理
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="btn-cta px-5 py-2.5 font-bold"
        >
          + アカウントを作成
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        登録されている全アカウントの一覧です。権限の変更・情報の編集・削除ができます。
      </p>

      {error ? (
        <div className="text-coral-a11y bg-telecareer-coral/10 border-2 border-telecareer-coral p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      ) : null}

      <div className="tc-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[680px]">
            <thead className="bg-telecareer-yellow/15 border-b-2 border-ink/10">
              <tr>
                <th className="px-4 py-3 text-sm font-bold text-ink">メール / ID</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">お名前</th>
                <th className="px-4 py-3 text-sm font-bold text-ink">権限</th>
                <th className="px-4 py-3 text-sm font-bold text-ink text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500 text-sm">
                    読み込み中...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500 text-sm">
                    アカウントがありません。
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = currentEmailResolved === user.email.toLowerCase();
                  return (
                    <tr key={user.email} className="border-b border-ink/5 align-middle">
                      <td className="px-4 py-3 font-bold text-ink max-w-[240px]">
                        <span className="block truncate">{user.email}</span>
                        {isSelf ? (
                          <span className="text-[10px] font-bold text-telecareer-orange">
                            ログイン中
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {user.contact_name?.trim() || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`tag-pill ${user.role === "admin" ? "tag-orange" : "tag-plain"}`}
                        >
                          {user.role === "admin" ? "管理者" : "会員"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(user)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-telecareer-orange text-telecareer-orange hover:bg-telecareer-orange/10 whitespace-nowrap"
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            disabled={isSelf || deletingEmail === user.email}
                            onClick={() => handleDelete(user)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-telecareer-coral text-coral-a11y hover:bg-telecareer-coral/10 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                            title={isSelf ? "ログイン中のアカウントは削除できません" : undefined}
                          >
                            {deletingEmail === user.email ? "削除中..." : "削除"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {creating ? (
        <AccountFormModal user={null} onClose={() => setCreating(false)} onSaved={handleSaved} />
      ) : null}
      {editing ? (
        <AccountFormModal user={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      ) : null}
    </div>
  );
}
