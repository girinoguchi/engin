import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-auth";
import type { Job } from "@/lib/types";

type JobRow = {
  id: string;
  slug: string;
  created_at: string;
  title: string;
  category: string;
  job_type: string;
  body: string;
  location: string | null;
  pay: string | null;
  pay_type: string | null;
  wage_min: number | null;
  work_period: string | null;
  headcount: number | null;
  deadline: string | null;
  tags: string[] | null;
  is_active: boolean;
};

export function mapJobRow(row: JobRow): Job {
  return {
    id: row.id,
    slug: row.slug,
    created_at: row.created_at,
    title: row.title,
    category: row.category,
    job_type: row.job_type,
    body: row.body ?? "",
    location: row.location,
    pay: row.pay,
    pay_type: row.pay_type,
    wage_min: row.wage_min != null ? Number(row.wage_min) : null,
    work_period: row.work_period,
    headcount: row.headcount,
    deadline: row.deadline,
    tags: row.tags ?? [],
    is_active: row.is_active,
  };
}

export async function fetchSupabaseJobs(): Promise<Job[] | null> {
  if (isDemoMode()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return null;
    return (data as JobRow[]).map(mapJobRow);
  } catch {
    return null;
  }
}
