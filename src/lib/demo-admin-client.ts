"use client";

import { loadClientSession } from "./demo-client-session";
import { isClientDemoMode } from "./admin-api-paths";

function authHeaders(): Record<string, string> {
  if (!isClientDemoMode()) return {};
  const session = loadClientSession();
  return session ? { "x-demo-email": session.email } : {};
}

/**
 * 管理者APIへのfetchラッパー。
 * localStorage のセッション email を `x-demo-email` ヘッダーで付与する。
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
    ...authHeaders(),
  };
  return fetch(input, { ...init, headers, cache: "no-store" });
}

export async function adminFetchJson<T = unknown>(
  input: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await adminFetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}
