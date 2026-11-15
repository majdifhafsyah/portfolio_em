-- Portfolio Firman Hafsyah — skema (sesuai desain Figma)
-- Jalankan di Supabase SQL Editor, lalu jalankan supabase/seed.sql.

create extension if not exists "pgcrypto";

-- Admin ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Profil / konten beranda (singleton id = 1) ---------------------------------
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  full_name text not null default 'Firman Hafsyah',
  headline text not null default 'Fullstack Architect • UI/UX Creator',
  bio text,                          -- paragraf hero
  intro text,                        -- kartu kanan hero
  photo_url text,                    -- foto PNG transparan
  available_for_hire boolean not null default true,
  location text,                     -- "Jakarta, ID • Remote"
  email text,
  website text,
  location_detail text,              -- "Jakarta, Indonesia • UTC+7"
  github_url text,
  linkedin_url text,
  twitter_url text,
  stat_years text not null default '3+',
  stat_projects text not null default '35+',
  stat_uptime text not null default '99%',
  lighthouse_score text not null default '100/100',
  quote text,
  quote_role text,
  contact_blurb text,
  workspace_image_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Proyek --------------------------------------------------------------------
do $$ begin
  create type public.project_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,                     -- "Enterprise SaaS"
  subtitle text,                     -- "Enterprise Platform" (label kartu publik)
  tagline text,                      -- one-liner
  description text,                  -- markdown
  cover_url text,
  gallery_urls text[] not null default '{}',
  tech_stack text[] not null default '{}',
  architecture text,                 -- Microservices / Serverless Edge / ...
  metrics jsonb not null default '[]'::jsonb,  -- [{ "value": "15,000+ req/s", "label": "Peak Throughput" }]
  live_url text,
  repo_url text,
  repo_private boolean not null default false,
  docs_url text,
  status public.project_status not null default 'draft',
  featured boolean not null default false,
  sort_order integer not null default 0,
  period text,                       -- "Q1 2024"
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_status_sort_idx on public.projects (status, sort_order, created_at desc);

-- Pendidikan, keahlian, proses kerja ----------------------------------------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institution text not null,
  period text not null,
  sort_order integer not null default 0
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null default 'search',   -- search | git | code | zap | rocket
  sort_order integer not null default 0
);

-- updated_at ----------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- RLS -----------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.process_steps enable row level security;

create policy "admins: admin read" on public.admins for select using (public.is_admin());

create policy "site_settings: public read" on public.site_settings for select using (true);
create policy "site_settings: admin write" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

create policy "projects: public read published" on public.projects for select
  using (status = 'published' or public.is_admin());
create policy "projects: admin write" on public.projects for all
  using (public.is_admin()) with check (public.is_admin());

create policy "education: public read" on public.education for select using (true);
create policy "education: admin write" on public.education for all
  using (public.is_admin()) with check (public.is_admin());

create policy "skills: public read" on public.skills for select using (true);
create policy "skills: admin write" on public.skills for all
  using (public.is_admin()) with check (public.is_admin());

create policy "process_steps: public read" on public.process_steps for select using (true);
create policy "process_steps: admin write" on public.process_steps for all
  using (public.is_admin()) with check (public.is_admin());

-- Storage: bucket publik untuk foto & tangkapan layar ------------------------
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "portfolio bucket: public read" on storage.objects for select
  using (bucket_id = 'portfolio');
create policy "portfolio bucket: admin insert" on storage.objects for insert
  with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio bucket: admin update" on storage.objects for update
  using (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio bucket: admin delete" on storage.objects for delete
  using (bucket_id = 'portfolio' and public.is_admin());
