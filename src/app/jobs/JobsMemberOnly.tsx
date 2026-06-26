"use client";

import { useEffect } from "react";
import { useDemoClientSession } from "@/lib/demo-client-session";

/**
 * 会員向けページ用ガード。デモ環境で localStorage の管理者セッションなら /admin へ戻す。
 */
export function JobsMemberOnly({ children }: { children: React.ReactNode }) {
  const { session, loading } = useDemoClientSession();

  useEffect(() => {
    if (loading) return;
    if (session?.role === "admin") {
      window.location.replace("/admin");
    }
  }, [loading, session]);

  return <>{children}</>;
}
