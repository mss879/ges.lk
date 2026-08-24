-- =============================================================================
-- 0003 — CRM (kanban pipelines, stages, leads)
-- =============================================================================
-- Pipelines and their stages are fully editable from the admin, EXCEPT the
-- seeded default pipeline and its "New Leads" stage, which are protected from
-- deletion because converted inquiries always land there.
--
-- Requires: 0001_admin_auth.sql, 0002_inquiries.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Pipelines
-- -----------------------------------------------------------------------------
create table if not exists public.pipelines (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  -- exactly one pipeline is the default; converted inquiries go here
  is_default boolean not null default false,
  position   int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enforce "at most one default pipeline" at the database level.
create unique index if not exists pipelines_single_default_idx
  on public.pipelines ((true)) where is_default;

-- -----------------------------------------------------------------------------
-- Stages (the kanban columns)
-- -----------------------------------------------------------------------------
create table if not exists public.pipeline_stages (
  id          uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines (id) on delete cascade,
  name        text not null,
  -- the landing column for converted inquiries; protected from deletion
  is_default  boolean not null default false,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists pipeline_stages_pipeline_idx
  on public.pipeline_stages (pipeline_id, position);

create unique index if not exists pipeline_stages_single_default_idx
  on public.pipeline_stages (pipeline_id) where is_default;

-- -----------------------------------------------------------------------------
-- Leads (the kanban cards)
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines (id) on delete cascade,
  stage_id    uuid not null references public.pipeline_stages (id) on delete cascade,
  -- where this lead came from, when it was converted out of an inquiry
  inquiry_id  uuid references public.inquiries (id) on delete set null,
  name        text not null,
  email       text,
  phone       text,
  subject     text,
  notes       text,
  value       numeric(12, 2),
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists leads_stage_position_idx on public.leads (stage_id, position);
create index if not exists leads_pipeline_idx on public.leads (pipeline_id);

-- Close the loop from 0002: inquiries.lead_id points back at the created lead.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'inquiries_lead_id_fkey'
  ) then
    alter table public.inquiries
      add constraint inquiries_lead_id_fkey
      foreign key (lead_id) references public.leads (id) on delete set null;
  end if;
end
$$;

drop trigger if exists pipelines_set_updated_at on public.pipelines;
create trigger pipelines_set_updated_at before update on public.pipelines
  for each row execute function public.set_updated_at();

drop trigger if exists pipeline_stages_set_updated_at on public.pipeline_stages;
create trigger pipeline_stages_set_updated_at before update on public.pipeline_stages
  for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Protect the default pipeline and the "New Leads" stage from deletion.
-- They can still be renamed and reordered — only removal is blocked, because
-- convert_inquiry_to_lead() depends on them existing.
-- -----------------------------------------------------------------------------
create or replace function public.protect_default_pipeline()
returns trigger
language plpgsql
as $$
begin
  if old.is_default then
    raise exception 'The default pipeline cannot be deleted — converted inquiries land here.';
  end if;
  return old;
end;
$$;

drop trigger if exists pipelines_protect_default on public.pipelines;
create trigger pipelines_protect_default
  before delete on public.pipelines
  for each row execute function public.protect_default_pipeline();

create or replace function public.protect_default_stage()
returns trigger
language plpgsql
as $$
begin
  -- Allow the cascade when the whole pipeline is going away legitimately.
  if exists (select 1 from public.pipelines where id = old.pipeline_id) and old.is_default then
    raise exception 'The default "New Leads" stage cannot be deleted — converted inquiries land here.';
  end if;
  return old;
end;
$$;

drop trigger if exists pipeline_stages_protect_default on public.pipeline_stages;
create trigger pipeline_stages_protect_default
  before delete on public.pipeline_stages
  for each row execute function public.protect_default_stage();

-- -----------------------------------------------------------------------------
-- Convert an inquiry into a lead in the default pipeline's default stage.
-- Idempotent: calling it twice returns the lead that already exists.
-- -----------------------------------------------------------------------------
create or replace function public.convert_inquiry_to_lead(p_inquiry_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiry   public.inquiries%rowtype;
  v_pipeline  uuid;
  v_stage     uuid;
  v_lead      uuid;
  v_position  int;
begin
  if not public.is_admin() then
    raise exception 'Not authorised';
  end if;

  select * into v_inquiry from public.inquiries where id = p_inquiry_id;
  if not found then
    raise exception 'Inquiry % not found', p_inquiry_id;
  end if;

  -- Already converted: hand back the existing lead rather than duplicating.
  if v_inquiry.lead_id is not null then
    return v_inquiry.lead_id;
  end if;

  select id into v_pipeline from public.pipelines where is_default limit 1;
  if v_pipeline is null then
    raise exception 'No default pipeline configured';
  end if;

  select id into v_stage
  from public.pipeline_stages
  where pipeline_id = v_pipeline and is_default
  limit 1;

  if v_stage is null then
    select id into v_stage
    from public.pipeline_stages
    where pipeline_id = v_pipeline
    order by position
    limit 1;
  end if;

  if v_stage is null then
    raise exception 'Default pipeline has no stages';
  end if;

  select coalesce(max(position), -1) + 1 into v_position
  from public.leads where stage_id = v_stage;

  insert into public.leads (pipeline_id, stage_id, inquiry_id, name, email, phone, subject, notes, position)
  values (v_pipeline, v_stage, v_inquiry.id, v_inquiry.name, v_inquiry.email,
          v_inquiry.phone, v_inquiry.subject, v_inquiry.message, v_position)
  returning id into v_lead;

  update public.inquiries
  set status = 'converted', lead_id = v_lead
  where id = p_inquiry_id;

  return v_lead;
end;
$$;

revoke execute on function public.convert_inquiry_to_lead(uuid) from public;
grant execute on function public.convert_inquiry_to_lead(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- RLS — CRM is admin-only end to end.
-- -----------------------------------------------------------------------------
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.leads enable row level security;

drop policy if exists "admins manage pipelines" on public.pipelines;
create policy "admins manage pipelines" on public.pipelines for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage stages" on public.pipeline_stages;
create policy "admins manage stages" on public.pipeline_stages for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage leads" on public.leads;
create policy "admins manage leads" on public.leads for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Seed the default pipeline. "New Leads" is the protected landing stage.
-- -----------------------------------------------------------------------------
insert into public.pipelines (name, is_default, position)
select 'Sales Pipeline', true, 0
where not exists (select 1 from public.pipelines where is_default);

insert into public.pipeline_stages (pipeline_id, name, is_default, position)
select p.id, s.name, s.is_default, s.position
from public.pipelines p
cross join (values
  ('New Leads', true,  0),
  ('Contacted', false, 1),
  ('Site Visit', false, 2),
  ('Quotation Sent', false, 3),
  ('Won', false, 4),
  ('Lost', false, 5)
) as s(name, is_default, position)
where p.is_default
  and not exists (select 1 from public.pipeline_stages where pipeline_id = p.id);
