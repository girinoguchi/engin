"use client";

import { Header } from "./Header";
import { clearClientSession, markLoggedOut, useDemoClientSession } from "@/lib/demo-client-session";

export function DemoHeaderClient() {
  const { session } = useDemoClientSession();

  const handleLogout = async () => {
    clearClientSession();
    markLoggedOut();
    try {
      await fetch("/api/demo/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    }
    window.location.assign("/login");
  };

  const user = session ? { email: session.email } : undefined;
  const profile = session
    ? {
        company_name: session.company_name,
        contact_name: session.contact_name,
        role: session.role,
      }
    : undefined;

  return <Header user={user} profile={profile} onLogout={session ? handleLogout : undefined} />;
}
