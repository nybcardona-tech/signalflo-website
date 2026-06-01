create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  email text null,
  selected_plan text not null,
  legal_version text not null default 'v1.0',
  accepted_at timestamptz not null default now(),
  source text not null default 'pricing_page_before_whop_checkout',
  user_agent text null
);

alter table public.legal_acceptances enable row level security;

create policy "Allow public legal acceptance inserts"
  on public.legal_acceptances
  for insert
  to anon
  with check (true);
