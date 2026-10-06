-- =============================================================================
-- 0010 — Blog
-- -----------------------------------------------------------------------------
-- Blog posts written in the admin's rich-text editor (/admin/blog), stored as
-- Tiptap (ProseMirror) JSON, plus a public storage bucket for their images.
--
-- Anyone can read a post once it is published and its publish time has passed
-- (so posts can be scheduled); only admins can see drafts or write. Renaming a
-- published post's slug keeps the old address working (previous_slugs →
-- permanent redirect on the site).
--
-- Requires: 0001_admin_auth.sql (public.is_admin, public.set_updated_at).
-- Safe to run more than once. Run 0011_seed_blog_posts.sql next to bring in
-- the existing articles.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Posts
-- -----------------------------------------------------------------------------

create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null default '' check (char_length(title) <= 200),
  slug             text not null unique
                   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  -- Slugs this post was published under before; their URLs redirect here.
  previous_slugs   text[] not null default '{}',
  excerpt          text check (excerpt is null or char_length(excerpt) <= 400),
  content          jsonb not null default '{"type": "doc", "content": []}'::jsonb,
  cover_url        text,
  cover_alt        text check (cover_alt is null or char_length(cover_alt) <= 300),
  cover_width      integer check (cover_width is null or cover_width > 0),
  cover_height     integer check (cover_height is null or cover_height > 0),
  category         text check (category is null or char_length(category) <= 60),
  author_name      text not null default 'Green Engineering Systems'
                   check (char_length(author_name) between 1 and 80),
  author_role      text check (author_role is null or char_length(author_role) <= 80),
  -- Up to a few highlight figures shown with the article: [{"label": "...", "value": "..."}]
  metrics          jsonb not null default '[]'::jsonb check (jsonb_typeof(metrics) = 'array'),
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  featured         boolean not null default false,
  seo_title        text check (seo_title is null or char_length(seo_title) <= 120),
  seo_description  text check (seo_description is null or char_length(seo_description) <= 300),
  reading_minutes  integer not null default 1 check (reading_minutes between 1 and 600),
  created_by       uuid default auth.uid() references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint blog_posts_published_dated check (status = 'draft' or published_at is not null)
);

comment on table public.blog_posts is
  'Blog posts. content is a Tiptap (ProseMirror) JSON document edited in /admin/blog.';
comment on column public.blog_posts.previous_slugs is
  'Former slugs of a published post; the site permanently redirects them to the current slug.';

create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_posts_previous_slugs_idx
  on public.blog_posts using gin (previous_slugs);

-- At most one featured post (shown large at the top of /blog).
create unique index if not exists blog_posts_single_featured_idx
  on public.blog_posts ((true)) where featured;


-- -----------------------------------------------------------------------------
-- Triggers: publish date + old-slug tracking, and updated_at
-- -----------------------------------------------------------------------------

-- Publishing without a date publishes now; renaming a published post keeps its
-- old URL alive.
create or replace function public.blog_post_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;

  if tg_op = 'UPDATE' and new.slug is distinct from old.slug and old.status = 'published' then
    new.previous_slugs := array(
      select distinct prior
      from unnest(array_append(new.previous_slugs, old.slug)) as prior
      where prior <> new.slug
    );
  end if;

  return new;
end;
$$;

revoke execute on function public.blog_post_fields() from public, anon, authenticated;

drop trigger if exists blog_posts_fields on public.blog_posts;
create trigger blog_posts_fields
  before insert or update on public.blog_posts
  for each row execute function public.blog_post_fields();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- Row level security
-- -----------------------------------------------------------------------------

alter table public.blog_posts enable row level security;

drop policy if exists "anyone reads published posts" on public.blog_posts;
create policy "anyone reads published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "admins read every post" on public.blog_posts;
create policy "admins read every post"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins add posts" on public.blog_posts;
create policy "admins add posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update posts" on public.blog_posts;
create policy "admins update posts"
  on public.blog_posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete posts" on public.blog_posts;
create policy "admins delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.is_admin());


-- -----------------------------------------------------------------------------
-- Storage: blog-images (public bucket; admins upload / replace / delete)
-- -----------------------------------------------------------------------------
-- Files go in <post id>/<random id>.<ext>, so deleting a post can remove its
-- folder. If inserting into storage.buckets is blocked on your project, create
-- a public bucket named "blog-images" in the dashboard and re-run this file.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  8388608, -- 8 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads blog images" on storage.objects;
create policy "public reads blog images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "admins upload blog images" on storage.objects;
create policy "admins upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "admins update blog images" on storage.objects;
create policy "admins update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "admins delete blog images" on storage.objects;
create policy "admins delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());
