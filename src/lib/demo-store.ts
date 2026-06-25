export type DemoProfile = {
  email: string;
  password: string;
  company_name: string;
  contact_name: string;
  role: "member" | "admin";
  program_genres: string[];
  needed_roles: string[];
};

export const DEMO_ACCOUNTS = [
  {
    label: "会員",
    email: "member@demo.local",
    password: "demo123",
  },
  {
    label: "管理者（管理画面は本番のみ）",
    email: "admin@demo.local",
    password: "demo123",
  },
] as const;

const profiles = new Map<string, DemoProfile>();

function seedDemoProfiles() {
  for (const account of DEMO_ACCOUNTS) {
    profiles.set(account.email, {
      email: account.email,
      password: account.password,
      company_name: account.label === "会員" ? "デモ株式会社" : "デモ運営",
      contact_name: account.label === "会員" ? "デモ 太郎" : "デモ 管理者",
      role: account.email.startsWith("admin") ? "admin" : "member",
      program_genres: ["バラエティ"],
      needed_roles: ["AD"],
    });
  }
}

seedDemoProfiles();

export function getDemoProfile(email: string): DemoProfile | undefined {
  return profiles.get(email.toLowerCase());
}

export function setDemoProfile(email: string, data: DemoProfile): void {
  profiles.set(email.toLowerCase(), data);
}
