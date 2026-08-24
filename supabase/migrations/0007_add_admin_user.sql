-- =============================================================================
-- 0007 — Grant admin access to admin@ges.lk
-- =============================================================================
-- Links the Supabase Auth user (admin@ges.lk) into public.admin_users allow-list,
-- which grants access to /admin and satisfies public.is_admin() RLS policies.
-- =============================================================================

insert into public.admin_users (id, email, full_name)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'full_name', 'GES Administrator')
from auth.users
where lower(email) = 'admin@ges.lk'
on conflict (id) do update
set 
  email = excluded.email,
  full_name = coalesce(public.admin_users.full_name, excluded.full_name);
