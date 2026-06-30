function hasValidSupabaseUrl(url: string | undefined): boolean {
  if (!url || url.includes("your_supabase")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** クライアント側でデモモードかどうか（NEXT_PUBLIC_* のみ参照） */
export function isClientDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !hasValidSupabaseUrl(url) || !key || key.includes("your_supabase");
}

export function adminJobsApiBase(): string {
  return isClientDemoMode() ? "/api/demo/admin/jobs" : "/api/admin/jobs";
}

export function adminUsersApiBase(): string {
  return isClientDemoMode() ? "/api/demo/admin/users" : "/api/admin/users";
}
