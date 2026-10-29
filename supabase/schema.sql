create table if not exists public.ss_evals (
  case_id text primary key,
  level text not null check (level in ('high','suspicious','none')),
  model_level text not null check (model_level in ('high','suspicious','none')),
  rule_level text not null check (rule_level in ('high','suspicious','none')),
  model text not null,
  created_at timestamptz not null default now()
);
alter table public.ss_evals enable row level security;
drop policy if exists "public read evals" on public.ss_evals;
create policy "public read evals" on public.ss_evals for select using (true);

create table if not exists public.ss_usage (
  day date primary key,
  count integer not null default 0
);
alter table public.ss_usage enable row level security;

create or replace function public.bump_ss_usage(cap integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  insert into public.ss_usage (day, count) values (current_date, 1)
  on conflict (day) do update set count = public.ss_usage.count + 1
  returning count into current_count;
  return current_count <= cap;
end;
$$;

revoke execute on function public.bump_ss_usage(integer) from public, anon, authenticated;
grant execute on function public.bump_ss_usage(integer) to service_role;
