-- =============================================================================
-- 0009 — Seed the current Homepage & About images
-- =============================================================================
-- Registers every editable slot with the image the site ships with today, so
-- the CMS opens pre-populated rather than empty.
--
-- URLs point at files under /public. storage_path is null for these, which is
-- how the admin knows not to try deleting them from the storage bucket —
-- replacing one uploads a new file and swaps the URL, leaving the original on
-- disk.
--
-- Safe to re-run: conflicts on (page, key) are ignored, so existing rows keep
-- whatever the admin has since set.
--
-- Requires: 0008_site_images.sql
-- =============================================================================

insert into public.site_images (page, key, url, alt) values
  ('about'::public.site_page, 'about_overview_1', '/about_office_2026.webp', 'Collage — Colombo office'),
  ('about'::public.site_page, 'about_overview_2', '/about_engineers_2026.webp', 'Collage — Technicians on a rooftop'),
  ('about'::public.site_page, 'about_overview_3', '/about_tech_2026.webp', 'Collage — Battery storage room'),
  ('about'::public.site_page, 'about_overview_4', '/about_building_2026.webp', 'Collage — Green facade building'),
  ('about'::public.site_page, 'about_history', '/about_history_lk_2026.webp', 'Our History — team portrait'),
  ('about'::public.site_page, 'about_vision', '/about_terraces_2026.webp', 'Our Vision — tea terraces banner'),
  ('about'::public.site_page, 'about_sustainability', '/about_values_2026.webp', 'Sustainability — engineer at dusk'),
  ('homepage'::public.site_page, 'hero_slide_1', '/hero-slider1_saj_wall.webp', 'Hero slide 1 — SAJ for Wall'),
  ('homepage'::public.site_page, 'hero_slide_2', '/hero-slider2_commercial_solar.webp', 'Hero slide 2 — Commercial Solar'),
  ('homepage'::public.site_page, 'hero_slide_3', '/hero-slider3_ev_charging.webp', 'Hero slide 3 — EV Charging'),
  ('homepage'::public.site_page, 'home_collage_1', '/about_us_office_v6.webp', 'Collage — Engineering office'),
  ('homepage'::public.site_page, 'home_collage_2', '/about_us_engineers_v6.webp', 'Collage — Engineers on site'),
  ('homepage'::public.site_page, 'home_collage_3', '/about_us_tech_v7.webp', 'Collage — Battery & inverter room'),
  ('homepage'::public.site_page, 'home_collage_4', '/about_us_building_v7.webp', 'Collage — Sustainable building')
on conflict (page, key) do nothing;
