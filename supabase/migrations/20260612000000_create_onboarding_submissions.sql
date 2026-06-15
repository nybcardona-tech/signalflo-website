create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  checkout_email text not null,
  dashboard_email text not null,
  phone text,
  discord_username text,
  telegram_contact text,
  membership_plan text not null,
  markets_traded text,
  experience_level text,
  referral_source text,
  notes text,
  risk_acknowledged boolean not null default false,
  status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_onboarding_submissions_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_onboarding_submissions_updated_at on public.onboarding_submissions;

create trigger set_onboarding_submissions_updated_at
before update on public.onboarding_submissions
for each row
execute function public.set_onboarding_submissions_updated_at();

alter table public.onboarding_submissions enable row level security;

create policy "Allow public onboarding submission inserts"
  on public.onboarding_submissions
  for insert
  to anon, authenticated
  with check (
    risk_acknowledged = true
    and status = 'pending_review'
  );
