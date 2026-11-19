create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_at text not null,
  credential_url text,
  image_url text,
  sort_order integer not null default 0
);

alter table public.certificates enable row level security;
create policy "certificates: public read" on public.certificates for select using (true);
create policy "certificates: admin write" on public.certificates for all
  using (public.is_admin()) with check (public.is_admin());
