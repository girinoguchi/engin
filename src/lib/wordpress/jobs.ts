import { loadDemoJobs } from "@/lib/demo-jobs-persist";
import { fetchSupabaseJobs } from "@/lib/supabase/jobs";
import type { Job, JobFilters } from "@/lib/types";
import { getWordPressApiUrl, JOBS_CACHE_TAG, JOBS_REVALIDATE_SECONDS } from "./config";

type WpJobPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  meta?: Record<string, string | number | boolean | null>;
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function parseTags(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[,\s]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean);
}

export function mapWpPostToJob(post: WpJobPost): Job {
  const meta = post.meta ?? {};
  const metaStr = (key: string) => {
    const value = meta[key];
    return value == null ? "" : String(value);
  };
  const wageRaw = metaStr("wage_min");
  const headRaw = metaStr("headcount");
  const isActiveRaw = metaStr("is_active");
  const bodyFromMeta = metaStr("body");

  return {
    id: String(post.id),
    slug: post.slug,
    created_at: post.date,
    title: decodeHtml(stripHtml(post.title.rendered)),
    category: metaStr("category") || "その他",
    job_type: metaStr("job_type") || "単発",
    body: bodyFromMeta || stripHtml(post.content.rendered),
    location: metaStr("location") || null,
    pay: metaStr("pay") || null,
    pay_type: metaStr("pay_type") || null,
    wage_min: wageRaw && !Number.isNaN(Number(wageRaw)) ? Number(wageRaw) : null,
    work_period: metaStr("work_period") || null,
    headcount: headRaw && !Number.isNaN(Number(headRaw)) ? Number(headRaw) : null,
    deadline: metaStr("deadline") || null,
    tags: parseTags(metaStr("tags")),
    is_active: !(isActiveRaw === "0" || isActiveRaw === "false"),
  };
}

function matchesInexperienced(job: Job): boolean {
  const haystack = `${job.title} ${job.body} ${job.tags.join(" ")}`;
  return /未経験|初心者|学生歓迎|初めて/.test(haystack);
}

function matchesKeyword(job: Job, q: string): boolean {
  const needle = q.toLowerCase();
  const fields = [job.title, job.body, job.location ?? "", job.category];
  if (fields.some((field) => field.toLowerCase().includes(needle))) {
    return true;
  }
  return job.tags.some((tag) => tag.toLowerCase().includes(needle));
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  let result = jobs.filter((job) => job.is_active);

  if (filters.jobType) {
    result = result.filter((job) => job.job_type === filters.jobType);
  }
  if (filters.category) {
    result = result.filter((job) => job.category === filters.category);
  }
  if (filters.area) {
    result = result.filter((job) => job.location?.includes(filters.area!));
  }
  if (filters.inexperienced === "1") {
    result = result.filter(matchesInexperienced);
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    result = result.filter((job) => matchesKeyword(job, q));
  }

  const sort = filters.sort || "new";
  if (sort === "deadline") {
    result = [...result].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  } else {
    result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  return result;
}

async function fetchWordPressJobs(): Promise<Job[] | null> {
  const apiUrl = getWordPressApiUrl();
  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/wp/v2/job?per_page=100&status=publish`, {
      next: {
        tags: [JOBS_CACHE_TAG],
        revalidate: JOBS_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      return null;
    }

    const posts = (await response.json()) as WpJobPost[];
    return posts.map(mapWpPostToJob);
  } catch {
    return null;
  }
}

export async function getJobs(): Promise<Job[]> {
  const wpJobs = await fetchWordPressJobs();
  if (wpJobs && wpJobs.length > 0) {
    return wpJobs;
  }
  const supabaseJobs = await fetchSupabaseJobs();
  if (supabaseJobs && supabaseJobs.length > 0) {
    return supabaseJobs;
  }
  return loadDemoJobs();
}

export async function getFilteredJobs(filters: JobFilters): Promise<Job[]> {
  const jobs = await getJobs();
  return filterJobs(jobs, filters);
}

export async function getJobById(id: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((job) => job.id === id && job.is_active) ?? null;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((job) => job.slug === slug && job.is_active) ?? null;
}

export async function getRecommendedJobs(categories: string[], limit = 6): Promise<Job[]> {
  const cats = categories.filter(Boolean);
  const jobs = await getJobs();
  const active = jobs.filter((job) => job.is_active);

  if (cats.length === 0) {
    return active.slice(0, limit);
  }

  return active.filter((job) => cats.includes(job.category)).slice(0, limit);
}

export { formatDeadline, categoryClass, jobTypeClass } from "./job-format";
