-- =============================================================================
-- 0006 — Seed the 30 existing projects
-- =============================================================================
-- Moves the portfolio that currently lives in public/1. Installations/ into the
-- database so it can be managed from the admin.
--
-- The image URLs still point at files under /public — nothing is copied into
-- Supabase Storage. Those rows have a null storage_path, which is how the admin
-- tells a legacy file (leave on disk) from an uploaded one (delete from the
-- bucket). New uploads go to the project-images bucket from 0005.
--
-- Only the first 7 images per folder are seeded, matching the 7-image cap in
-- 0004. Run this once, on an empty projects table.
--
-- Requires: 0004_projects.sql
-- =============================================================================

-- AgStar_Anuradhapura  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('AgStar', 'Anuradhapura', null, 'commercial'::public.project_category, 0)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'AgStar', v.position from p, (values
  ('/1. Installations/AgStar_Anuradhapura/21W.webp', 0),
  ('/1. Installations/AgStar_Anuradhapura/42W.webp', 1),
  ('/1. Installations/AgStar_Anuradhapura/Anuradhapura1 800kW.webp', 2),
  ('/1. Installations/AgStar_Anuradhapura/Anuradhapura2 800kW.webp', 3),
  ('/1. Installations/AgStar_Anuradhapura/DJI_0004.webp', 4),
  ('/1. Installations/AgStar_Anuradhapura/DJI_0013.webp', 5),
  ('/1. Installations/AgStar_Anuradhapura/DJI_0026.webp', 6)
) as v(url, position);

-- Anuradhapura CPC  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Anuradhapura CPC', null, null, 'commercial'::public.project_category, 1)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Anuradhapura CPC', v.position from p, (values
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_115223.webp', 0),
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_115307.webp', 1),
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_115324.webp', 2),
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_115425.webp', 3),
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_125813.webp', 4),
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_125829.webp', 5),
  ('/1. Installations/Anuradhapura CPC/IMG_20161125_125830.webp', 6)
) as v(url, position);

-- Capt Shivantha Fernando_Bolawalana  (5 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Capt Shivantha Fernando', 'Bolawalana', null, 'residential'::public.project_category, 2)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Capt Shivantha Fernando', v.position from p, (values
  ('/1. Installations/Capt Shivantha Fernando_Bolawalana/WhatsApp Image 2024-07-08 at 11.48.02.webp', 0),
  ('/1. Installations/Capt Shivantha Fernando_Bolawalana/WhatsApp Image 2024-07-08 at 11.48.03 (1).webp', 1),
  ('/1. Installations/Capt Shivantha Fernando_Bolawalana/WhatsApp Image 2024-07-08 at 11.48.03.webp', 2),
  ('/1. Installations/Capt Shivantha Fernando_Bolawalana/WhatsApp Image 2024-07-08 at 11.48.04 (1).webp', 3),
  ('/1. Installations/Capt Shivantha Fernando_Bolawalana/WhatsApp Image 2024-07-08 at 11.48.04.webp', 4)
) as v(url, position);

-- Capt. Suneth Fernando_Angoda  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Capt. Suneth Fernando', 'Angoda', null, 'residential'::public.project_category, 3)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Capt. Suneth Fernando', v.position from p, (values
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG-20191031-WA0051.webp', 0),
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG-20191031-WA0052.webp', 1),
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG-20191031-WA0053.webp', 2),
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG-20191031-WA0054.webp', 3),
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG_20160525_104852.webp', 4),
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG_20160525_104902.webp', 5),
  ('/1. Installations/Capt. Suneth Fernando_Angoda/IMG_20160525_104936.webp', 6)
) as v(url, position);

-- Capt. Wajira Wanasinghe_Kottawa  (4 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Capt. Wajira Wanasinghe', 'Kottawa', null, 'residential'::public.project_category, 4)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Capt. Wajira Wanasinghe', v.position from p, (values
  ('/1. Installations/Capt. Wajira Wanasinghe_Kottawa/WhatsApp Image 2024-07-13 at 09.07.18.webp', 0),
  ('/1. Installations/Capt. Wajira Wanasinghe_Kottawa/WhatsApp Image 2024-07-13 at 09.07.19 (1).webp', 1),
  ('/1. Installations/Capt. Wajira Wanasinghe_Kottawa/WhatsApp Image 2024-07-13 at 09.07.19 (2).webp', 2),
  ('/1. Installations/Capt. Wajira Wanasinghe_Kottawa/WhatsApp Image 2024-07-13 at 09.07.19.webp', 3)
) as v(url, position);

-- Capt.Lakshitha Athugoda_Athulkotte  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Capt. Lakshitha Athugoda', 'Athulkotte', null, 'residential'::public.project_category, 5)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Capt. Lakshitha Athugoda', v.position from p, (values
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.33.webp', 0),
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.35.webp', 1),
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.36 (1).webp', 2),
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.36.webp', 3),
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.37 (1).webp', 4),
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.37 (2).webp', 5),
  ('/1. Installations/Capt.Lakshitha Athugoda_Athulkotte/WhatsApp Image 2024-07-13 at 09.09.37.webp', 6)
) as v(url, position);

-- Capt.Namal Fernando_Nugegoda  (5 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Capt. Namal Fernando', 'Nugegoda', null, 'residential'::public.project_category, 6)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Capt. Namal Fernando', v.position from p, (values
  ('/1. Installations/Capt.Namal Fernando_Nugegoda/WhatsApp Image 2024-07-13 at 09.25.49 (1).webp', 0),
  ('/1. Installations/Capt.Namal Fernando_Nugegoda/WhatsApp Image 2024-07-13 at 09.25.49 (2).webp', 1),
  ('/1. Installations/Capt.Namal Fernando_Nugegoda/WhatsApp Image 2024-07-13 at 09.25.49.webp', 2),
  ('/1. Installations/Capt.Namal Fernando_Nugegoda/WhatsApp Image 2024-07-13 at 09.25.50 (1).webp', 3),
  ('/1. Installations/Capt.Namal Fernando_Nugegoda/WhatsApp Image 2024-07-13 at 09.25.50.webp', 4)
) as v(url, position);

-- Capt.Zayan Salie_ Colombo  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Capt. Zayan Salie', 'Colombo', null, 'residential'::public.project_category, 7)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Capt. Zayan Salie', v.position from p, (values
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.40 (1).webp', 0),
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.40 (2).webp', 1),
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.40.webp', 2),
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.41.webp', 3),
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.42.webp', 4),
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.43 (1).webp', 5),
  ('/1. Installations/Capt.Zayan Salie_ Colombo/WhatsApp Image 2024-07-13 at 09.26.43.webp', 6)
) as v(url, position);

-- Dr. Sarath Rathnayake_Maharagama  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Dr. Sarath Rathnayake', 'Maharagama', null, 'residential'::public.project_category, 8)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Dr. Sarath Rathnayake', v.position from p, (values
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0110.webp', 0),
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0111.webp', 1),
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0113.webp', 2),
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0114.webp', 3),
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0115.webp', 4),
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0116.webp', 5),
  ('/1. Installations/Dr. Sarath Rathnayake_Maharagama/IMG-20191031-WA0117.webp', 6)
) as v(url, position);

-- LR Motors_Rajagiriya  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('LR Motors', 'Rajagiriya', null, 'commercial'::public.project_category, 9)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'LR Motors', v.position from p, (values
  ('/1. Installations/LR Motors_Rajagiriya/20190502_104252.webp', 0),
  ('/1. Installations/LR Motors_Rajagiriya/20190502_104258.webp', 1),
  ('/1. Installations/LR Motors_Rajagiriya/20190502_104329.webp', 2),
  ('/1. Installations/LR Motors_Rajagiriya/20190502_104343.webp', 3),
  ('/1. Installations/LR Motors_Rajagiriya/20190502_104500.webp', 4),
  ('/1. Installations/LR Motors_Rajagiriya/IMG-20191031-WA0007.webp', 5),
  ('/1. Installations/LR Motors_Rajagiriya/IMG-20191031-WA0008.webp', 6)
) as v(url, position);

-- Mr. Harendara Perera_Piliyandala  (3 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Harendara Perera', 'Piliyandala', null, 'residential'::public.project_category, 10)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Harendara Perera', v.position from p, (values
  ('/1. Installations/Mr. Harendara Perera_Piliyandala/19e8177e-274d-4451-830c-928fec24582b.webp', 0),
  ('/1. Installations/Mr. Harendara Perera_Piliyandala/80de800a-491f-4d83-a403-230cc79a98fc.webp', 1),
  ('/1. Installations/Mr. Harendara Perera_Piliyandala/8ed9751c-4986-41a1-92bd-915269b95cef.webp', 2)
) as v(url, position);

-- Mr. Kasthuri Warnakulasuriya_Negombo  (4 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Kasthuri Warnakulasuriya', 'Negombo', null, 'residential'::public.project_category, 11)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Kasthuri Warnakulasuriya', v.position from p, (values
  ('/1. Installations/Mr. Kasthuri Warnakulasuriya_Negombo/613367c2-d2cb-4be0-a7eb-ba8a33835c5b.webp', 0),
  ('/1. Installations/Mr. Kasthuri Warnakulasuriya_Negombo/a8ca8005-d866-4421-add3-c873486dcbf6.webp', 1),
  ('/1. Installations/Mr. Kasthuri Warnakulasuriya_Negombo/ae44923d-d6a2-48b4-9fb3-c4661e855de1.webp', 2),
  ('/1. Installations/Mr. Kasthuri Warnakulasuriya_Negombo/f0e1ed9a-c8cc-43c9-9a80-365cbc17ee5a.webp', 3)
) as v(url, position);

-- Mr. Mangala Pathiraja_Yakkala  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Mangala Pathiraja', 'Yakkala', null, 'residential'::public.project_category, 12)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Mangala Pathiraja', v.position from p, (values
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/27880042-675c-497f-8d87-84e2f5d17669.webp', 0),
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/50fd6422-a49a-4849-abf6-94047cebd23b.webp', 1),
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/548b67b2-be20-40c3-8de6-56b2a9954ff0.webp', 2),
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/7a11a152-5469-4f12-b16b-8174411f975b.webp', 3),
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/8ed970d4-54f3-4b13-90d5-ef8e405e5b19.webp', 4),
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/b9fb0a0a-aa5c-4a26-b048-ea6c4596ceff.webp', 5),
  ('/1. Installations/Mr. Mangala Pathiraja_Yakkala/c829be83-2a91-469f-822c-2e66cd56a1e9.webp', 6)
) as v(url, position);

-- Mr. Manikkam_Colombo 03  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Manikkam', 'Colombo 03', null, 'residential'::public.project_category, 13)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Manikkam', v.position from p, (values
  ('/1. Installations/Mr. Manikkam_Colombo 03/DJI_0063.webp', 0),
  ('/1. Installations/Mr. Manikkam_Colombo 03/IMG-20191101-WA0004.webp', 1),
  ('/1. Installations/Mr. Manikkam_Colombo 03/IMG-20191101-WA0006.webp', 2),
  ('/1. Installations/Mr. Manikkam_Colombo 03/IMG-20191101-WA0011.webp', 3),
  ('/1. Installations/Mr. Manikkam_Colombo 03/IMG-20191101-WA0012.webp', 4),
  ('/1. Installations/Mr. Manikkam_Colombo 03/IMG_20160427_095138.webp', 5),
  ('/1. Installations/Mr. Manikkam_Colombo 03/IMG_20160427_095342.webp', 6)
) as v(url, position);

-- Mr. Murugadan_Negombo  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Murugadan', 'Negombo', null, 'residential'::public.project_category, 14)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Murugadan', v.position from p, (values
  ('/1. Installations/Mr. Murugadan_Negombo/DJI_0024.webp', 0),
  ('/1. Installations/Mr. Murugadan_Negombo/DJI_0034 (2).webp', 1),
  ('/1. Installations/Mr. Murugadan_Negombo/IMG-20191101-WA0000.webp', 2),
  ('/1. Installations/Mr. Murugadan_Negombo/IMG-20191101-WA0001.webp', 3),
  ('/1. Installations/Mr. Murugadan_Negombo/IMG-20191101-WA0003.webp', 4),
  ('/1. Installations/Mr. Murugadan_Negombo/IMG-20191101-WA0007.webp', 5),
  ('/1. Installations/Mr. Murugadan_Negombo/IMG-20191101-WA0009.webp', 6)
) as v(url, position);

-- Mr. Prasad - Kelaniya - 6kW Installation  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Prasad', 'Kelaniya', '6 kW', 'residential'::public.project_category, 15)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Prasad', v.position from p, (values
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/0c8b2176-3238-445d-86a6-7ee4bc63e141.webp', 0),
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/19cde08d-1c1c-4163-a907-73e7772dc57f.webp', 1),
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/33309daa-e234-412b-94db-555213b4d8a0.webp', 2),
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/68cf514c-63ef-44a8-9db1-65b560340c05.webp', 3),
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/9b59787f-8640-4bb9-87f5-9952934306ad.webp', 4),
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/c6f47ea0-d882-43c8-a7e4-3fce9ad1b6e7.webp', 5),
  ('/1. Installations/Mr. Prasad - Kelaniya - 6kW Installation/e3c1dc9b-a6dd-447d-817b-6b94d4f1f107.webp', 6)
) as v(url, position);

-- Mr. Priyantha Rankothgedara_  (2 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Priyantha Rankothgedara', null, null, 'residential'::public.project_category, 16)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Priyantha Rankothgedara', v.position from p, (values
  ('/1. Installations/Mr. Priyantha Rankothgedara_/IMG-20191031-WA0079.webp', 0),
  ('/1. Installations/Mr. Priyantha Rankothgedara_/IMG-20191031-WA0080.webp', 1)
) as v(url, position);

-- Mr. Rohan Liyanaarachchi_Kelaniya  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Rohan Liyanaarachchi', 'Kelaniya', null, 'residential'::public.project_category, 17)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Rohan Liyanaarachchi', v.position from p, (values
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/20181108_093004.webp', 0),
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/DJI_0002.webp', 1),
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/DJI_0012.webp', 2),
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/DJI_0021.webp', 3),
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/IMG-20191031-WA0050.webp', 4),
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/IMG-20191031-WA0055.webp', 5),
  ('/1. Installations/Mr. Rohan Liyanaarachchi_Kelaniya/IMG_20160831_171037.webp', 6)
) as v(url, position);

-- Mr. Roshan Indika_Kelaniya  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Roshan Indika', 'Kelaniya', null, 'residential'::public.project_category, 18)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Roshan Indika', v.position from p, (values
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/109db1e7-387f-490b-a13b-db67156e5f71.webp', 0),
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/IMG_20160514_122611.webp', 1),
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/IMG_20160514_122741.webp', 2),
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/IMG_20160514_134209.webp', 3),
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/IMG_20160526_164511.webp', 4),
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/IMG_20160526_164552.webp', 5),
  ('/1. Installations/Mr. Roshan Indika_Kelaniya/IMG_20160526_164614.webp', 6)
) as v(url, position);

-- Mr. Samaraweera - Kelaniya - 6kW  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Samaraweera', 'Kelaniya', '6 kW', 'residential'::public.project_category, 19)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Samaraweera', v.position from p, (values
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/01491800-c912-4e92-ba7b-8b980d701e96.webp', 0),
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/0c5a28d1-6359-40c6-9955-498362af1b9f.webp', 1),
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/18f1b7a2-f52f-4050-8bec-37dae38f5df4.webp', 2),
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/2a49f369-a21f-4524-b036-b84590544217.webp', 3),
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/442d5022-f115-4663-b897-54c27b111b0d.webp', 4),
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/49cf2841-ca9c-4b48-8f5d-9a039d525ef6.webp', 5),
  ('/1. Installations/Mr. Samaraweera - Kelaniya - 6kW/56a35afc-92f1-4b9d-841c-2621092e4c86.webp', 6)
) as v(url, position);

-- Mr. Senaka Peiris-Micro inverter installation  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Senaka Peiris', null, null, 'residential'::public.project_category, 20)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Senaka Peiris', v.position from p, (values
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/1.webp', 0),
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/10.webp', 1),
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/11.webp', 2),
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/12.webp', 3),
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/13.webp', 4),
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/14.webp', 5),
  ('/1. Installations/Mr. Senaka Peiris-Micro inverter installation/15.webp', 6)
) as v(url, position);

-- Mr. Tharaka Nanayakkara-Mattegoda  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Tharaka Nanayakkara', 'Mattegoda', null, 'residential'::public.project_category, 21)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Tharaka Nanayakkara', v.position from p, (values
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/1.webp', 0),
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/10.webp', 1),
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/11.webp', 2),
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/12.webp', 3),
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/2.webp', 4),
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/3.webp', 5),
  ('/1. Installations/Mr. Tharaka Nanayakkara-Mattegoda/4.webp', 6)
) as v(url, position);

-- Mr.Dinesh Colambathanthri_Bokundara  (5 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Dinesh Colambathanthri', 'Bokundara', null, 'residential'::public.project_category, 22)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Dinesh Colambathanthri', v.position from p, (values
  ('/1. Installations/Mr.Dinesh Colambathanthri_Bokundara/WhatsApp Image 2024-07-13 at 09.03.58 (1).webp', 0),
  ('/1. Installations/Mr.Dinesh Colambathanthri_Bokundara/WhatsApp Image 2024-07-13 at 09.03.58.webp', 1),
  ('/1. Installations/Mr.Dinesh Colambathanthri_Bokundara/WhatsApp Image 2024-07-13 at 09.03.59 (1).webp', 2),
  ('/1. Installations/Mr.Dinesh Colambathanthri_Bokundara/WhatsApp Image 2024-07-13 at 09.03.59.webp', 3),
  ('/1. Installations/Mr.Dinesh Colambathanthri_Bokundara/WhatsApp Image 2024-07-13 at 09.04.00.webp', 4)
) as v(url, position);

-- Mr.Jinath Premaratna_Kottawa  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Jinath Premaratna', 'Kottawa', null, 'residential'::public.project_category, 23)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Jinath Premaratna', v.position from p, (values
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.42 (1).webp', 0),
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.42 (2).webp', 1),
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.42 (3).webp', 2),
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.42 (4).webp', 3),
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.42.webp', 4),
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.43 (1).webp', 5),
  ('/1. Installations/Mr.Jinath Premaratna_Kottawa/WhatsApp Image 2024-07-13 at 09.05.43 (2).webp', 6)
) as v(url, position);

-- Mr.Wajira Wijesinghe_Pannipitiya  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mr. Wajira Wijesinghe', 'Pannipitiya', null, 'residential'::public.project_category, 24)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mr. Wajira Wijesinghe', v.position from p, (values
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.58.55.webp', 0),
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.58.56.webp', 1),
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.58.57.webp', 2),
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.58.58.webp', 3),
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.58.59 (1).webp', 4),
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.58.59.webp', 5),
  ('/1. Installations/Mr.Wajira Wijesinghe_Pannipitiya/WhatsApp Image 2024-07-13 at 08.59.00.webp', 6)
) as v(url, position);

-- Mrs Shehani - 10 kw - 40 kW  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Mrs Shehani', null, '10 kW + 40 kW', 'residential'::public.project_category, 25)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Mrs Shehani', v.position from p, (values
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/00e21958-e853-4eaf-b210-87ac18555573.webp', 0),
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/0c4e9ffa-6ea5-4dd0-a3f2-e31ed8cbe391.webp', 1),
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/0c604b51-ff9c-461d-b9f8-4d7d0d6d673e.webp', 2),
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/10 kw.webp', 3),
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/10kW.webp', 4),
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/13b0f336-1178-4a83-b7e7-dad0d9737f33.webp', 5),
  ('/1. Installations/Mrs Shehani - 10 kw - 40 kW/19f9a239-4b78-4195-84df-ef6497c9be6b.webp', 6)
) as v(url, position);

-- Ms.Thamara Wurkus_Dehiwala  (4 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Ms. Thamara Wurkus', 'Dehiwala', null, 'residential'::public.project_category, 26)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Ms. Thamara Wurkus', v.position from p, (values
  ('/1. Installations/Ms.Thamara Wurkus_Dehiwala/WhatsApp Image 2024-07-13 at 09.04.29 (1).webp', 0),
  ('/1. Installations/Ms.Thamara Wurkus_Dehiwala/WhatsApp Image 2024-07-13 at 09.04.29.webp', 1),
  ('/1. Installations/Ms.Thamara Wurkus_Dehiwala/WhatsApp Image 2024-07-13 at 09.04.30 (1).webp', 2),
  ('/1. Installations/Ms.Thamara Wurkus_Dehiwala/WhatsApp Image 2024-07-13 at 09.04.30.webp', 3)
) as v(url, position);

-- Nawinna Medical Hospital_Maharagama  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Nawinna Medical Hospital', 'Maharagama', null, 'commercial'::public.project_category, 27)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Nawinna Medical Hospital', v.position from p, (values
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20180813_122847.webp', 0),
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20180813_122854.webp', 1),
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20180830_122846.webp', 2),
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20180830_122903.webp', 3),
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20180830_154252.webp', 4),
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20180830_154413.webp', 5),
  ('/1. Installations/Nawinna Medical Hospital_Maharagama/20181026_122258.webp', 6)
) as v(url, position);

-- Orilka Gym_Maharagama  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Orilka Gym', 'Maharagama', null, 'commercial'::public.project_category, 28)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Orilka Gym', v.position from p, (values
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.04.webp', 0),
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.05.webp', 1),
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.40.webp', 2),
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.41 (1).webp', 3),
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.41.webp', 4),
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.42 (1).webp', 5),
  ('/1. Installations/Orilka Gym_Maharagama/WhatsApp Image 2024-06-21 at 11.26.42.webp', 6)
) as v(url, position);

-- Royal Will Global Pvt Ltd. - Kurana  (7 images)
with p as (
  insert into public.projects (name, location, capacity, category, position)
  values ('Royal Will Global Pvt Ltd.', 'Kurana', null, 'commercial'::public.project_category, 29)
  returning id
)
insert into public.project_images (project_id, url, alt, position)
select p.id, v.url, 'Royal Will Global Pvt Ltd.', v.position from p, (values
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/2dc33fa0-1d1d-4bd2-b312-3e10a2ba7de1.webp', 0),
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/302167ec-2178-4bee-ae7f-9bba4a82bf2e.webp', 1),
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/3daa1a87-ce6c-49eb-9fac-dcf87bf307d1.webp', 2),
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/40340da9-33d4-4dc6-94b0-4666fb68063b.webp', 3),
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/6ff5f8d9-512d-4f51-b450-fac9ffa3bf06.webp', 4),
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/a00919fa-769b-4a92-b42a-2d96811c76b0.webp', 5),
  ('/1. Installations/Royal Will Global Pvt Ltd. - Kurana/a15bf6a3-ec17-4965-a727-35bd377119c4.webp', 6)
) as v(url, position);
