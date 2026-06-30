import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { parseJobInput } from "@/lib/demo-jobs-persist";
import { createClient } from "@/lib/supabase/server";
import { mapJobRow } from "@/lib/supabase/jobs";

export const dynamic = "force-dynamic";

function noStore<T>(body: T, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function slugify(title: string): string {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/\\?#]+/g, "")
      .slice(0, 80) || `job-${Date.now()}`
  );
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return noStore({ error: error.message }, 500);
  return noStore({ jobs: (data ?? []).map(mapJobRow) });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = parseJobInput(body);
  if ("error" in parsed) return noStore({ error: parsed.error }, 400);

  const supabase = await createClient();
  const slug = body.slug ? String(body.slug).trim() : slugify(parsed.title);
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      slug,
      title: parsed.title,
      category: parsed.category,
      job_type: parsed.job_type,
      body: parsed.body,
      location: parsed.location,
      pay: parsed.pay,
      pay_type: parsed.pay_type,
      wage_min: parsed.wage_min,
      work_period: parsed.work_period,
      headcount: parsed.headcount,
      deadline: parsed.deadline,
      tags: parsed.tags,
      is_active: parsed.is_active,
    })
    .select("*")
    .single();

  if (error) return noStore({ error: error.message }, 500);
  return noStore({ ok: true, job: mapJobRow(data) }, 201);
}
