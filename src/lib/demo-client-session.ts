"use client";

import { useEffect, useState } from "react";

export type ClientSession = {
  id: string;
  email: string;
  company_name: string | null;
  contact_name: string | null;
  role: "member" | "admin";
  user_type?: string | null;
  interested_categories?: string[];
  phone?: string | null;
  birthdate?: string | null;
};

const KEY = "demo_session_v1";
const EVENT = "demo-session-change";

export function saveClientSession(session: ClientSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore
  }
}

export function loadClientSession(): ClientSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ClientSession;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearClientSession(): void {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore
  }
}

export function demoAfterLoginPath(role: ClientSession["role"]): string {
  return role === "admin" ? "/admin" : "/jobs";
}

/**
 * クライアント側のデモセッション状態。
 * Cookieをブロックするブラウザ(iOS Brave等)でもログイン状態を保持できる。
 * `loading` はマウント前(SSR/初回)を表し、ハイドレーション不一致を避ける。
 */
export function useDemoClientSession() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(loadClientSession());
    setLoading(false);

    const onChange = () => setSession(loadClientSession());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return { session, loading };
}
