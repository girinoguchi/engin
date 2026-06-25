import type { Profile } from "./types";

const DEMO_COOKIE = "demo_session";

export type DemoSession = {
  id: string;
  email: string;
  company_name: string | null;
  contact_name: string | null;
  role: "member" | "admin";
};

function hasValidSupabaseUrl(url: string | undefined): boolean {
  if (!url || url.includes("your_supabase")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasValidSupabaseUrl(url) || !key || key.includes("your_supabase")) {
    return true;
  }
  return false;
}

export function parseDemoCookie(cookieHeader: string | null): DemoSession | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${DEMO_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1], "base64url").toString("utf8");
    return JSON.parse(decoded) as DemoSession;
  } catch {
    return null;
  }
}

export function createDemoSessionCookie(profile: Profile): string {
  const payload: DemoSession = {
    id: profile.id,
    email: profile.email ?? "",
    company_name: profile.company_name ?? null,
    contact_name: profile.contact_name ?? null,
    role: profile.role,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${DEMO_COOKIE}=${encoded}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
}

export function clearDemoSessionCookie(): string {
  return `${DEMO_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function demoSessionToProfile(session: DemoSession): Profile {
  return {
    id: session.id,
    created_at: "",
    company_name: session.company_name,
    contact_name: session.contact_name,
    email: session.email,
    role: session.role,
    program_genres: [],
    needed_roles: [],
  };
}
