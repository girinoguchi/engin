"use client";

import { useState } from "react";
import { adminFetchJson } from "@/lib/demo-admin-client";
import { AdminModalShell } from "./AdminModalShell";

export type AdminUser = {
  email: string;
  company_name: string;
  contact_name: string;
  role: "member" | "admin";
  user_type?: string | null;
  phone?: string | null;
  has_password?: boolean;
};

export function AccountFormModal({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(user);
  const [email, setEmail] = useState(user?.email ?? "");
  const [contactName, setContactName] = useState(user?.contact_name ?? "");
  const [companyName, setCompanyName] = useState(user?.company_name ?? "");
  const [role, setRole] = useState<"member" | "admin">(user?.role ?? "member");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !email.trim()) {
      setError("メールアドレスは必須です");
      return;
    }
    if (!isEdit && !password.trim()) {
      setError("パスワードは必須です");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      email: isEdit ? user!.email : email.trim().toLowerCase(),
      contact_name: contactName,
      company_name: companyName,
      role,
      phone,
    };
    if (password.trim()) payload.password = password.trim();

    const { ok, data } = await adminFetchJson<{ error?: string }>("/api/demo/admin/users", {
      method: isEdit ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!ok) {
      setError(data.error ?? "保存に失敗しました");
      return;
    }
    onSaved();
  };

  return (
    <AdminModalShell
      title={isEdit ? "アカウントを編集" : "アカウントを新規作成"}
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline-coral px-7 py-2.5 font-bold w-full sm:w-auto"
          >
            キャンセル
          </button>
          <button
            type="submit"
            form="admin-account-form"
            disabled={saving}
            className="btn-cta px-7 py-2.5 font-bold disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? "保存中..." : isEdit ? "更新する" : "作成する"}
          </button>
        </div>
      }
    >
      {error ? (
        <div className="text-coral-a11y bg-telecareer-coral/10 border-2 border-telecareer-coral p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      ) : null}

      <form id="admin-account-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="tc-label">メールアドレス / ID {isEdit ? "" : "*"}</label>
          <input
            type="text"
            value={email}
            disabled={isEdit}
            onChange={(e) => setEmail(e.target.value)}
            className="tc-input disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="tc-label">お名前</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="tc-input"
          />
        </div>
        <div>
          <label className="tc-label">会社名・所属</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="tc-input"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="tc-label">権限</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "member" | "admin")}
              className="tc-input"
            >
              <option value="member">会員</option>
              <option value="admin">管理者</option>
            </select>
          </div>
          <div>
            <label className="tc-label">電話番号</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="tc-input"
            />
          </div>
        </div>
        <div>
          <label className="tc-label">
            パスワード {isEdit ? "（変更する場合のみ入力）" : "*"}
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="tc-input"
          />
        </div>
      </form>
    </AdminModalShell>
  );
}
