import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("demo_session");
  return NextResponse.redirect(new URL("/", getSiteOrigin()));
}
