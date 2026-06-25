export const JOBS_CACHE_TAG = "jobs";
export const JOBS_REVALIDATE_SECONDS = 60;

export function getWordPressApiUrl(): string | null {
  const raw = process.env.WORDPRESS_API_URL?.trim();
  if (!raw || raw.includes("your_")) {
    return null;
  }
  return raw.replace(/\/$/, "");
}

export function getRevalidateSecret(): string | null {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret || secret.includes("your_")) {
    return null;
  }
  return secret;
}
