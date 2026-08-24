-- =============================================================================
-- 0008 — Site images (Homepage & About CMS)
-- =============================================================================
-- One row per editable image slot on the Homepage and About pages. The app
-- looks rows up by (page, key); the keys are defined in
-- src/data/siteImageSlots.ts and must stay in sync with it.
--
-- A missing row is not an error — the page falls back to the shipped image, so
-- the site keeps rendering if a slot is deleted or never populated.
--
-- Requires: 0001_admin_auth.sql
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'site_page') then
    create type public.site_page as enum ('homepage', 'about');
  end if;
end
$$;

create table if not exists public.site_images (
  id           uuid primary key default gen_random_uuid(),
  page         public.site_page not null,
  -- stable slot identifier, e.g. 'hero_slide_1'
  key          text not null,
  url          text not null,
  -- set for files uploaded to the site-images bucket; null for shipped assets
  -- under /public, which must not be deleted from storage
  storage_path text,
  alt          text,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (page, key)
);

comment on table public.site_images is
  'Editable image slots for the Homepage and About pages. Keys mirror src/data/siteImageSlots.ts.';

create index if not exists site_images_page_idx on public.site_images (page);

drop trigger if exists site_images_set_updated_at on public.site_images;
create trigger site_images_set_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS — public reads (the pages render them), admins write.
-- -----------------------------------------------------------------------------
alter table public.site_images enable row level security;

drop policy if exists "public reads site images" on public.site_images;
create policy "public reads site images"
  on public.site_images for select
  to anon, authenticated
  using (true);

drop policy if exists "admins write site images" on public.site_images;
create policy "admins write site images"
  on public.site_images for all
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage bucket for uploads from the Homepage/About CMS.
--
-- If your project blocks direct writes to storage.buckets, create it in the
-- dashboard (Storage > New bucket > "site-images", Public) and run only the
-- policies below.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads site image files" on storage.objects;
create policy "public reads site image files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists "admins upload site image files" on storage.objects;
create policy "admins upload site image files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admins update site image files" on storage.objects;
create policy "admins update site image files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admins delete site image files" on storage.objects;
create policy "admins delete site image files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());
