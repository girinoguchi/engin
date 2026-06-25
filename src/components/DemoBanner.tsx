import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { isDemoMode } from "@/lib/demo-auth";
import { DEMO_ACCOUNTS } from "@/lib/demo-store";
import { getProjectRoot } from "@/lib/project-root";

function getMobilePreviewUrl(): string | null {
  try {
    const path = join(getProjectRoot(), ".data/preview-url.txt");
    if (!existsSync(path)) return null;
    const url = readFileSync(path, "utf8").trim();
    return url || null;
  } catch {
    return null;
  }
}

export function DemoBanner() {
  if (!isDemoMode()) return null;

  const mobileUrl = getMobilePreviewUrl();

  return (
    <div className="bg-amber-100 border-b-2 border-amber-500 text-amber-950 px-4 py-2.5 text-sm text-center">
      <p className="font-bold">
        デモモード — Supabase 未接続のプレビュー環境です
        {process.env.NEXT_PUBLIC_BUILD_ID ? (
          <span className="ml-2 font-mono text-xs opacity-80">（ビルド: {process.env.NEXT_PUBLIC_BUILD_ID}）</span>
        ) : null}
      </p>
      {mobileUrl ? (
        <p className="mt-1.5 text-xs sm:text-sm font-bold">
          スマホで見る:{" "}
          <a href={mobileUrl} className="link-accent underline break-all">
            {mobileUrl}
          </a>
          {mobileUrl.includes("loca.lt") ? (
            <span className="block mt-0.5 font-normal text-amber-900/80">
              ※ 初回は「Click to Continue」をタップしてください
            </span>
          ) : null}
        </p>
      ) : null}
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
