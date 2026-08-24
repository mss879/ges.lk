-- =============================================================================
-- 0004 — Projects
-- =============================================================================
-- Backs the public /projects page and the admin Projects screen.
-- Each project is tagged residential or commercial and carries up to seven
-- uploaded images (the seven-image cap is enforced by a trigger below, so the
-- limit holds even if something writes outside the admin UI).
--
-- Requires: 0001_admin_auth.sql
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'project_category') then
    create type public.project_category as enum ('residential', 'commercial');
  end if;
end
$$;

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  location     text,
  -- free text rather than numeric: real values include "10 kW + 40 kW"
  capacity     text,
  category     public.project_category not null default 'residential',
  description  text,
  is_published boolean not null default true,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on column public.projects.capacity is
  'System capacity as displayed, e.g. "6 kW" or "10 kW + 40 kW".';

create index if not exists projects_category_idx on public.projects (category, position);
create index if not exists projects_published_idx on public.projects (is_published, position);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Images
--
-- `storage_path` is set for files uploaded to the project-images bucket and is
-- what the admin deletes from storage. `url` is the address the site renders —
-- for seeded legacy rows that is a path under /public instead.
-- -----------------------------------------------------------------------------
create table if not exists public.project_images (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  url          text not null,
  storage_path text,
  alt          text,
  position     int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists project_images_project_idx
  on public.project_images (project_id, position);

-- -----------------------------------------------------------------------------
-- Seven images per project, enforced in the database.
-- -----------------------------------------------------------------------------
create or replace function public.enforce_max_project_images()
returns trigger
language plpgsql
as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.project_images
  where project_id = new.project_id;

  if v_count >= 7 then
    raise exception 'A project can have at most 7 images (project % already has %).',
      new.project_id, v_count;
  end if;

  return new;
end;
$$;

drop trigger if exists project_images_max_seven on public.project_images;
create trigger project_images_max_seven
  before insert on public.project_images
  for each row execute function public.enforce_max_project_images();

-- -----------------------------------------------------------------------------
-- RLS — the public site reads published projects; only admins write.
-- -----------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "admins write projects" on public.projects;
create policy "admins write projects"
  on public.projects for all
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads images of published projects" on public.project_images;
create policy "public reads images of published projects"
  on public.project_images for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.is_published
    )
  );

drop policy if exists "admins write project images" on public.project_images;
create policy "admins write project images"
  on public.project_images for all
  to authenticated
  using (public.is_admin()) with check (public.is_admin());
