import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { parseJobInput } from "@/lib/demo-jobs-persist";
import { createClient } from "@/lib/supabase/server";
import { mapJobRow } from "@/lib/supabase/jobs";

export const dynamic = "force-dynamic";

function noStore<T>(body: T, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) return noStore({ error: error.message }, 500);
  if (!data) return noStore({ error: "求人が見つかりません" }, 404);
  return noStore({ job: mapJobRow(data) });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = parseJobInput(body);
  if ("error" in parsed) return noStore({ error: parsed.error }, 400);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({
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
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) return noStore({ error: error.message }, 500);
  if (!data) return noStore({ error: "求人が見つかりません" }, 404);
  return noStore({ ok: true, job: mapJobRow(data) });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("jobs").delete().eq("id", id).select("id").maybeSingle();
  if (error) return noStore({ error: error.message }, 500);
  if (!data) return noStore({ error: "求人が見つかりません" }, 404);
  return noStore({ ok: true });
}
