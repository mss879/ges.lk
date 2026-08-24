-- =============================================================================
-- 0001 — Admin authentication
-- =============================================================================
-- Supabase Auth owns the accounts; this table decides which of those accounts
-- may use /admin. Every other feature's RLS policy hangs off public.is_admin().
--
-- AFTER RUNNING THIS: create your user in Supabase Auth (Authentication >
-- Users > Add user), then grant it admin access with the INSERT at the bottom
-- of this file.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Shared helper: keeps updated_at honest on every table that has one.
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Admin allow-list
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Accounts allowed into /admin. Membership here is what public.is_admin() checks.';

alter table public.admin_users enable row level security;

-- -----------------------------------------------------------------------------
-- is_admin() — the single source of truth for admin authorisation.
--
-- SECURITY DEFINER so it can read admin_users without tripping that table's own
-- RLS, which would otherwise recurse when admin_users policies call it.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- An admin may read the allow-list (so the UI can show who has access) but
-- cannot edit it from the app — grant access via SQL, deliberately.
drop policy if exists "admins read admin list" on public.admin_users;
create policy "admins read admin list"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

-- =============================================================================
-- GRANT YOURSELF ACCESS
-- Replace the email below with the user you created in Supabase Auth, then run.
-- =============================================================================
-- insert into public.admin_users (id, email, full_name)
-- select id, email, 'Site Administrator'
-- from auth.users
-- where email = 'you@ges.lk'
-- on conflict (id) do nothing;
