import type { Profile } from "@/lib/types";

export type AdminUserResponse = {
  email: string;
  company_name: string;
  contact_name: string;
  role: "member" | "admin";
  user_type?: string | null;
  phone?: string | null;
  has_password?: boolean;
};

export function profileToAdminUser(profile: Profile): AdminUserResponse {
  return {
    email: profile.email ?? "",
    company_name: profile.company_name ?? "",
    contact_name: profile.contact_name ?? "",
    role: profile.role,
    user_type: profile.user_type ?? null,
    phone: profile.phone ?? null,
    has_password: true,
  };
}
