import { NextResponse } from "next/server";
import { parseDemoCookie } from "@/lib/demo-auth";

export const dynamic = "force-dynamic";

/** Cookie のデモセッションを返す（localStorage 同期用） */
export async function GET(req: Request) {
  const session = parseDemoCookie(req.headers.get("cookie"));
  return NextResponse.json(
    { session },
    { headers: { "Cache-Control": "no-store" } }
  );
}
