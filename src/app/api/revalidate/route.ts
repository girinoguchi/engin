import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getRevalidateSecret, JOBS_CACHE_TAG } from "@/lib/wordpress/config";

export async function POST(request: Request) {
  const secret = getRevalidateSecret();
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET が未設定です" }, { status: 500 });
  }

  let body: { secret?: string; tag?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  const tag = body.tag || JOBS_CACHE_TAG;
  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
