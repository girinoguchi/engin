import { NextResponse } from "next/server";
import { clearDemoSessionCookieOnResponse } from "@/lib/demo-session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  clearDemoSessionCookieOnResponse(response, req);
  return response;
}
