import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { profileToAdminUser } from "@/lib/admin-users";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient, hasServiceRoleKey } from "@/lib/supabase/service";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

function noStore<T>(body: T, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return noStore({ error: error.message }, 500);
  const users = ((data ?? []) as Profile[]).map(profileToAdminUser);
  return noStore({ users });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);
  if (!hasServiceRoleKey()) {
    return noStore(
      { error: "アカウント作成には SUPABASE_SERVICE_ROLE_KEY の設定が必要です" },
      503
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "").trim();
  if (!email) return noStore({ error: "メールアドレスは必須です" }, 400);
  if (!password) return noStore({ error: "パスワードは必須です" }, 400);

  const service = createServiceClient();
  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) {
    const message =
      createError.message.includes("already") || createError.status === 422
        ? "このメールアドレスは既に登録されています"
        : createError.message;
    return noStore({ error: message }, createError.status === 422 ? 409 : 500);
  }

  const userId = created.user?.id;
  if (!userId) return noStore({ error: "ユーザーの作成に失敗しました" }, 500);

  const profile = {
    id: userId,
    email,
    company_name: String(body.company_name ?? ""),
    contact_name: String(body.contact_name ?? ""),
    role: body.role === "admin" ? "admin" : "member",
    program_genres: [] as string[],
    needed_roles: [] as string[],
    user_type: body.user_type !== undefined ? String(body.user_type) || null : null,
    phone: body.phone !== undefined ? String(body.phone) || null : null,
  };

  const { error: profileError } = await service.from("profiles").upsert(profile);
  if (profileError) {
    await service.auth.admin.deleteUser(userId);
    return noStore({ error: profileError.message }, 500);
  }

  return noStore({ ok: true, user: profileToAdminUser(profile as Profile) }, 201);
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email) return noStore({ error: "メールアドレスは必須です" }, 400);

  const supabase = await createClient();
  const { data: existing, error: findError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (findError) return noStore({ error: findError.message }, 500);
  if (!existing) return noStore({ error: "アカウントが見つかりません" }, 404);

  const profile = existing as Profile;
  if (
    admin.email?.toLowerCase() === email &&
    body.role &&
    body.role !== "admin"
  ) {
    return noStore({ error: "自分自身の管理者権限は変更できません" }, 400);
  }

  const updates: Partial<Profile> = {
    company_name:
      body.company_name !== undefined ? String(body.company_name) : profile.company_name,
    contact_name:
      body.contact_name !== undefined ? String(body.contact_name) : profile.contact_name,
    role: body.role === "admin" || body.role === "member" ? body.role : profile.role,
    phone: body.phone !== undefined ? String(body.phone) || null : profile.phone,
    user_type: body.user_type !== undefined ? String(body.user_type) || null : profile.user_type,
  };

  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profile.id)
    .select("*")
    .single();

  if (updateError) return noStore({ error: updateError.message }, 500);

  const password = typeof body.password === "string" ? body.password.trim() : "";
  if (password) {
    if (!hasServiceRoleKey()) {
      return noStore(
        { error: "パスワード変更には SUPABASE_SERVICE_ROLE_KEY の設定が必要です" },
        503
      );
    }
    const service = createServiceClient();
    const { error: pwError } = await service.auth.admin.updateUserById(profile.id, {
      password,
    });
    if (pwError) return noStore({ error: pwError.message }, 500);
  }

  return noStore({ ok: true, user: profileToAdminUser(updated as Profile) });
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return noStore({ error: "権限がありません" }, 403);
  if (!hasServiceRoleKey()) {
    return noStore(
      { error: "アカウント削除には SUPABASE_SERVICE_ROLE_KEY の設定が必要です" },
      503
    );
  }

  const url = new URL(req.url);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? url.searchParams.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return noStore({ error: "メールアドレスは必須です" }, 400);

  if (admin.email?.toLowerCase() === email) {
    return noStore({ error: "ログイン中のアカウントは削除できません" }, 400);
  }

  const supabase = await createClient();
  const { data: existing, error: findError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (findError) return noStore({ error: findError.message }, 500);
  if (!existing) return noStore({ error: "アカウントが見つかりません" }, 404);

  const service = createServiceClient();
  const { error: deleteError } = await service.auth.admin.deleteUser(existing.id);
  if (deleteError) return noStore({ error: deleteError.message }, 500);

  return noStore({ ok: true });
}
