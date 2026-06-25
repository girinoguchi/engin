import type { DemoSession } from "./demo-auth";

export function createDemoSessionPayload(stored: {
  email: string;
  company_name: string;
  contact_name: string;
  role: "member" | "admin";
  user_type?: string | null;
  interested_categories?: string[];
  phone?: string | null;
  birthdate?: string | null;
}): DemoSession {
  return {
    id: `demo-${stored.email}-${Date.now()}`,
    email: stored.email,
    company_name: stored.company_name || null,
    contact_name: stored.contact_name || null,
    role: stored.role || "member",
    user_type: stored.user_type ?? null,
    interested_categories: stored.interested_categories ?? [],
    phone: stored.phone ?? null,
    birthdate: stored.birthdate ?? null,
  };
}

export function isSecureRequest(req: Request): boolean {
  // 明示的な強制（クラウドプレビューは常にHTTPS配信のため起動時に設定）
  if (process.env.DEMO_PUBLIC_HTTPS === "1") return true;

  const xfProto = (req.headers.get("x-forwarded-proto") ?? "").split(",")[0].trim();
  if (xfProto === "https") return true;

  // RFC7239 Forwarded ヘッダー
  const forwarded = req.headers.get("forwarded") ?? "";
  if (/proto=https/i.test(forwarded)) return true;

  // フロントが付けがちな各種ヒント
  if ((req.headers.get("x-forwarded-ssl") ?? "").toLowerCase() === "on") return true;
  if (req.headers.get("x-forwarded-protocol") === "https") return true;

  try {
    if (new URL(req.url).protocol === "https:") return true;
  } catch {
    // ignore
  }
  return false;
}

export type DemoCookieOptions = {
  path: string;
  httpOnly: boolean;
  sameSite: "lax" | "none";
  secure: boolean;
  maxAge: number;
};

function buildCookieOptions(secure: boolean): DemoCookieOptions {
  // iOS Safari/Brave(WebKit)は SameSite=None の Cookie をトップレベル遷移でも
  // 取りこぼすことがあるため、同一サイトのトップレベル遷移で確実に送られる Lax を使う。
  // （ログイン後の /jobs・/mypage 遷移はいずれも同一サイトのトップレベルGET）
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  };
}

export function demoSessionCookieOptions(req: Request): DemoCookieOptions {
  return buildCookieOptions(isSecureRequest(req));
}

export function isSecureFromHeaders(get: (name: string) => string | null): boolean {
  if (process.env.DEMO_PUBLIC_HTTPS === "1") return true;
  const xfProto = (get("x-forwarded-proto") ?? "").split(",")[0].trim();
  if (xfProto === "https") return true;
  const forwarded = get("forwarded") ?? "";
  if (/proto=https/i.test(forwarded)) return true;
  if ((get("x-forwarded-ssl") ?? "").toLowerCase() === "on") return true;
  if (get("x-forwarded-protocol") === "https") return true;
  return false;
}

export function demoSessionCookieOptionsFromHeaders(
  get: (name: string) => string | null
): DemoCookieOptions {
  return buildCookieOptions(isSecureFromHeaders(get));
}

export function encodeDemoSessionCookie(session: DemoSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}
