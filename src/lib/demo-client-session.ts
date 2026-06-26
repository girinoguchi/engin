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
const LOGGED_OUT_KEY = "demo_logged_out";
const EVENT = "demo-session-change";

let syncPromise: Promise<ClientSession | null> | null = null;

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

export function markLoggedOut(): void {
  try {
    sessionStorage.setItem(LOGGED_OUT_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearLoggedOutFlag(): void {
  try {
    sessionStorage.removeItem(LOGGED_OUT_KEY);
  } catch {
    // ignore
  }
}

export function isLoggedOutFlagSet(): boolean {
  try {
    return sessionStorage.getItem(LOGGED_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function demoAfterLoginPath(role: ClientSession["role"]): string {
  return role === "admin" ? "/admin" : "/jobs";
}

/** Cookie → localStorage 同期（重複リクエストは1本にまとめる） */
export async function syncClientSessionFromCookie(): Promise<ClientSession | null> {
  if (isLoggedOutFlagSet()) return null;

  const existing = loadClientSession();
  if (existing) return existing;

  if (!syncPromise) {
    syncPromise = fetch("/api/demo/session", { credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((data: { session?: ClientSession | null }) => {
        if (data.session?.email) {
          saveClientSession(data.session);
          return data.session;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        syncPromise = null;
      });
  }

  return syncPromise;
}

/**
 * クライアント側のデモセッション状態。
 * Cookieをブロックするブラウザ(iOS Brave等)でもログイン状態を保持できる。
 * `loading` は Cookie 同期完了まで true（リダイレクトループ防止）。
 */
export function useDemoClientSession() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const refresh = () => setSession(loadClientSession());

    syncClientSessionFromCookie().then(() => {
      if (!active) return;
      refresh();
      setLoading(false);
    });

    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { session, loading };
}
