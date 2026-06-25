"use client";

import { useEffect } from "react";
import { DemoHeaderClient } from "./DemoHeaderClient";
import { Footer } from "./Footer";
import { useDemoClientSession } from "@/lib/demo-client-session";

export function AdminDemoShell({ children }: { children: React.ReactNode }) {
  const { session, loading } = useDemoClientSession();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      window.location.assign("/login");
      return;
    }
    if (session.role !== "admin") {
      window.location.assign("/jobs");
    }
  }, [loading, session]);

  if (loading || !session || session.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-telecareer-surface text-sm text-gray-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <DemoHeaderClient />
      <main className="mx-auto max-w-6xl px-4 py-6 flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
