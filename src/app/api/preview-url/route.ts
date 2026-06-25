import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getProjectRoot } from "@/lib/project-root";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const path = join(getProjectRoot(), ".data/preview-url.txt");
    if (!existsSync(path)) {
      return NextResponse.json({ url: null }, { headers: { "Cache-Control": "no-store" } });
    }
    const url = readFileSync(path, "utf8").trim();
    return NextResponse.json({ url: url || null }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ url: null }, { headers: { "Cache-Control": "no-store" } });
  }
}
