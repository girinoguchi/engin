import { NextResponse } from "next/server";
import { appendFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getDemoProfile } from "@/lib/demo-store";
import { getProjectRoot } from "@/lib/project-root";
import {
  createDemoSessionPayload,
  demoSessionCookieOptions,
  encodeDemoSessionCookie,
} from "@/lib/demo-session";

function debugLog(event: string, req: Request, extra: Record<string, unknown> = {}) {
  if (process.env.DEMO_DEBUG !== "1") return;
  try {
    const dir = join(getProjectRoot(), ".data");
    mkdirSync(dir, { recursive: true });
    const headers: Record<string, string> = {};
    for (const key of ["x-forwarded-proto", "host", "x-forwarded-host", "origin", "referer", "user-agent"]) {
      const v = req.headers.get(key);
      if (v) headers[key] = v;
    }
    appendFileSync(
      join(dir, "login-debug.log"),
      JSON.stringify({ t: new Date().toISOString(), event, headers, ...extra }) + "\n",
      "utf8"
    );
  } catch {
    // ignore
  }
}

function safeRedirectTarget(value: FormDataEntryValue | null): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/jobs";
}

function redirectResponse(location: string): NextResponse {
  // 相対パスの Location を使い、内部ホスト名(0.0.0.0等)に飛ばさないようにする
  const res = new NextResponse(null, { status: 303 });
  res.headers.set("Location", location);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const redirectTo = safeRedirectTarget(form.get("redirect"));
  const redirectParam = encodeURIComponent(redirectTo);

  if (!email || !password) {
    return redirectResponse(`/login?error=empty&redirect=${redirectParam}`);
  }

  const stored = getDemoProfile(email);
  if (!stored) {
    debugLog("form_login_not_found", req, { email });
    return redirectResponse(`/login?error=notfound&redirect=${redirectParam}`);
  }
  if (stored.password !== password) {
    debugLog("form_login_bad_password", req, { email });
    return redirectResponse(`/login?error=badpass&redirect=${redirectParam}`);
  }

  const session = createDemoSessionPayload(stored);
  const options = demoSessionCookieOptions(req);
  debugLog("form_login_ok", req, {
    email,
    redirectTo,
    cookieSecure: options.secure,
    cookieSameSite: options.sameSite,
  });
  const res = redirectResponse(redirectTo);
  res.cookies.set("demo_session", encodeDemoSessionCookie(session), options);
  return res;
}
