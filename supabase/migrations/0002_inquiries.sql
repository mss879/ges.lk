-- =============================================================================
-- 0002 — Inquiries
-- =============================================================================
-- Submissions from the website contact form. Anyone may INSERT (that is the
-- public form); only admins may read, update or delete.
--
-- Requires: 0001_admin_auth.sql
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'inquiry_status') then
    create type public.inquiry_status as enum ('new', 'read', 'converted', 'archived');
  end if;
end
$$;

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  status     public.inquiry_status not null default 'new',
  -- set by the "move to CRM" action in the admin; see 0003_crm.sql
  lead_id    uuid,
  source     text not null default 'website_contact_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.inquiries is
  'Contact-form submissions. Convert to a CRM lead from the admin Inquiries screen.';

create index if not exists inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.inquiries enable row level security;

-- The public contact form posts as the anon key. Insert only — a visitor can
-- submit an enquiry but can never read anyone else's.
drop policy if exists "anyone can submit an inquiry" on public.inquiries;
create policy "anyone can submit an inquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read inquiries" on public.inquiries;
create policy "admins read inquiries"
  on public.inquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update inquiries" on public.inquiries;
create policy "admins update inquiries"
  on public.inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete inquiries" on public.inquiries;
create policy "admins delete inquiries"
  on public.inquiries for delete
  to authenticated
  using (public.is_admin());
