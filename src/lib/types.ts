export type ProfileRole = "member" | "admin";

export interface Profile {
  id: string;
  created_at: string;
  company_name: string | null;
  contact_name: string | null;
  email: string | null;
  role: ProfileRole;
  program_genres: string[];
  needed_roles: string[];
}

export interface Talent {
  id: string;
  created_at: string;
  name: string;
  age: number | null;
  gender: string | null;
  role: string;
  company: string | null;
  bio: string | null;
  experience_programs: string[];
  genres: string[];
  skills: string[];
  specialties: string[];
  qualifications: string[];
  hashtags: string[];
  image_url: string | null;
  is_active: boolean;
}

export interface RequestRow {
  id: string;
  created_at: string;
  talent_id: string;
  requester_user_id: string;
  requester_company_name: string | null;
  requester_contact_name: string | null;
  requester_email: string | null;
  memo: string | null;
  status: string;
}

export const ROLE_OPTIONS = ["AD", "D", "P"] as const;
export const GENRE_OPTIONS = [
  "バラエティ",
  "報道",
  "情報",
  "ドキュメンタリー",
  "Web動画",
] as const;
export const JOB_CATEGORY_OPTIONS = [
  "エキストラ",
  "音響スタッフ",
  "照明スタッフ",
  "撮影・カメラ",
  "制作・AD",
  "イベント運営",
  "その他",
] as const;
export const JOB_TYPE_OPTIONS = ["単発", "中長期案件", "社員募集"] as const;
export const PAY_TYPE_OPTIONS = ["", "時給", "日給", "月給", "その他"] as const;
export const USER_TYPE_OPTIONS = [
  "学生",
  "フリーランス",
  "会社員",
  "未経験",
  "その他",
] as const;
export const REQUEST_STATUSES = ["未対応", "対応中", "完了"] as const;

export interface Job {
  id: string;
  created_at: string;
  title: string;
  category: string;
  job_type: string;
  location: string | null;
  pay_type: string | null;
  pay_amount: string | null;
  description: string | null;
  is_active: boolean;
}
