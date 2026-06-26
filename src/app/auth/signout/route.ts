import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-auth";
import { clearDemoSessionCookieOnResponse } from "@/lib/demo-session";

export async function POST(req: Request) {
  if (isDemoMode()) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    clearDemoSessionCookieOnResponse(response, req);
    return response;
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", req.url));
}
