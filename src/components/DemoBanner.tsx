import { isDemoMode } from "@/lib/demo-auth";
import { DEMO_ACCOUNTS } from "@/lib/demo-store";

export function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div className="bg-amber-100 border-b-2 border-amber-500 text-amber-950 px-4 py-2.5 text-sm text-center">
      <p className="font-bold">デモモード — Supabase 未接続のプレビュー環境です</p>
      <p className="mt-1 text-xs sm:text-sm">
        テストログイン:{" "}
        {DEMO_ACCOUNTS.map((account, index) => (
          <span key={account.email}>
            {index > 0 ? " / " : ""}
            {account.label} <code className="font-mono">{account.email}</code>（パスワード:{" "}
            <code className="font-mono">{account.password}</code>）
          </span>
        ))}
      </p>
    </div>
  );
}
