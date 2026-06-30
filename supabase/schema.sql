-- テレキャリア名簿 MVP テーブル設計
-- Supabase SQL Editor で実行してください。

-- 1. profiles（会員情報）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  company_name text,
  contact_name text,
  email text,
  role text default 'member' check (role in ('member', 'admin')),
  program_genres text[] default '{}',
  needed_roles text[] default '{}',
  user_type text,
  interested_categories text[] default '{}',
  birthdate date,
  phone text,
  newsletter_opt_in boolean default false
);

-- 2. talents（人材名簿）
create table if not exists public.talents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  age int,
  gender text,
  role text not null,
  company text,
  bio text,
  experience_programs text[] default '{}',
  genres text[] default '{}',
  skills text[] default '{}',
  specialties text[] default '{}',
  qualifications text[] default '{}',
  hashtags text[] default '{}',
  image_url text,
  is_active boolean default true
);

-- 3. jobs（求人）
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  created_at timestamptz default now(),
  title text not null,
  category text not null default 'その他',
  job_type text not null default '単発',
  body text default '',
  location text,
  pay text,
  pay_type text,
  wage_min numeric,
  work_period text,
  headcount int,
  deadline text,
  tags text[] default '{}',
  is_active boolean default true
);

-- 4. requests（依頼）
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  talent_id uuid not null references public.talents(id) on delete cascade,
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  requester_company_name text,
  requester_contact_name text,
  requester_email text,
  memo text,
  status text default '未対応'
);

-- RLS 有効化
alter table public.profiles enable row level security;
alter table public.talents enable row level security;
alter table public.jobs enable row level security;
alter table public.requests enable row level security;

-- profiles: 本人は自分の情報を読める/更新できる、管理者は全件読める
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_admin_select_all" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "profiles_admin_update_all" on public.profiles
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- jobs: 公開求人は誰でも閲覧、管理は管理者のみ
create policy "jobs_select_active" on public.jobs
  for select using (is_active = true);

create policy "jobs_admin_all" on public.jobs
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- talents: ログインユーザーは一覧・詳細閲覧可能、追加/編集/削除は管理者のみ
create policy "talents_select_authenticated" on public.talents
  for select to authenticated using (is_active = true);

create policy "talents_admin_all" on public.talents
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- requests: 一般会員は自分が作った依頼のみ、管理者は全件、作成はログインユーザー
create policy "requests_select_own" on public.requests
  for select using (requester_user_id = auth.uid());

create policy "requests_insert_authenticated" on public.requests
  for insert with check (auth.uid() = requester_user_id);

create policy "requests_admin_select_all" on public.requests
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "requests_admin_update" on public.requests
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 管理者が talents の select で is_active に関係なく見られるように（既存の select は is_active = true のみ）
-- 管理者用に「全件」見る必要があるので、管理者は別ポリシーで全件許可
create policy "talents_admin_select_all" on public.talents
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- インデックス
create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_is_active on public.jobs(is_active);
create index if not exists idx_jobs_created_at on public.jobs(created_at desc);
create index if not exists idx_talents_role on public.talents(role);
create index if not exists idx_talents_genres on public.talents using gin(genres);
create index if not exists idx_talents_hashtags on public.talents using gin(hashtags);
create index if not exists idx_requests_talent_id on public.requests(talent_id);
create index if not exists idx_requests_requester_user_id on public.requests(requester_user_id);
