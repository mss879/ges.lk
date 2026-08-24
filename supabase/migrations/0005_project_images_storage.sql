-- =============================================================================
-- 0005 — Storage bucket for uploaded project images
-- =============================================================================
-- Creates the public `project-images` bucket the admin uploads into, and the
-- storage policies that let visitors read while restricting writes to admins.
--
-- Requires: 0001_admin_auth.sql
--
-- NOTE: if your Supabase project restricts direct writes to storage.objects,
-- create the bucket in the dashboard instead (Storage > New bucket >
-- "project-images", Public) and run only the policy block below.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  10485760, -- 10 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Policies
-- -----------------------------------------------------------------------------
drop policy if exists "public reads project images" on storage.objects;
create policy "public reads project images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "admins upload project images" on storage.objects;
create policy "admins upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admins update project images" on storage.objects;
create policy "admins update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admins delete project images" on storage.objects;
create policy "admins delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
