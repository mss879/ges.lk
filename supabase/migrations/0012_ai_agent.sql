-- =============================================================================
-- 0012 — AI agent
-- -----------------------------------------------------------------------------
-- The website's AI sales assistant (bottom-right chat widget) and its admin
-- section (/admin/ai-agent):
--
--   ai_agent_settings   one row: on/off, name, greeting, instructions, and the
--                       solar calculator's numbers (panel size, yield, tariffs,
--                       optional price ranges) the agent estimates with.
--   ai_knowledge        facts the client adds for the agent to know.
--   ai_chat_sessions    one row per conversation (every chat is saved; the
--                       Privacy Policy explains this to visitors).
--   ai_chat_messages    the transcript.
--
-- Leads the agent captures go straight into the CRM (public.leads) through
-- create_ai_lead(), marked source = 'ai_agent'.
--
-- SECURITY MODEL — read before adding a policy
-- The widget never talks to these tables directly. Every read and write goes
-- through the site's /api/chat route on the server, using the service-role
-- key, which scopes each visitor query to their own (session id, token) pair.
-- So there are NO anon policies here, and anon's table privileges are revoked
-- outright. An anon SELECT policy wide enough to let the widget read its own
-- transcript would expose every visitor's conversation to anyone holding the
-- public anon key. Admins read and edit through RLS (public.is_admin()).
--
-- Requires: 0001_admin_auth.sql, 0003_crm.sql. Safe to run more than once.
-- Run 0013_seed_ai_agent.sql next for the default settings and knowledge.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Settings (single row, id = 1)
-- -----------------------------------------------------------------------------

create table if not exists public.ai_agent_settings (
  id                     smallint primary key default 1 check (id = 1),
  is_enabled             boolean not null default true,
  agent_name             text not null default 'GES Solar Assistant'
                         check (char_length(agent_name) between 1 and 60),
  greeting               text not null default ''
                         check (char_length(greeting) <= 600),
  suggested_questions    text[] not null default '{}',
  instructions           text not null default ''
                         check (char_length(instructions) <= 8000),
  daily_message_cap      integer not null default 1500
                         check (daily_message_cap between 10 and 100000),

  -- Solar calculator
  panel_watt             numeric(6,1) not null default 590 check (panel_watt between 100 and 1000),
  panel_length_m         numeric(5,3) not null default 2.278 check (panel_length_m between 0.5 and 3.5),
  panel_width_m          numeric(5,3) not null default 1.134 check (panel_width_m between 0.3 and 2.5),
  usable_roof_ratio      numeric(4,3) not null default 0.700 check (usable_roof_ratio > 0 and usable_roof_ratio <= 1),
  monthly_yield_per_kwp  numeric(6,1) not null default 120 check (monthly_yield_per_kwp between 50 and 250),
  -- Optional domestic block tariff: [{"upTo": 60, "rate": 11, "fixed": 0}, …, {"upTo": null, …}]
  tariff_blocks          jsonb not null default '[]'::jsonb check (jsonb_typeof(tariff_blocks) = 'array'),
  avg_tariff_domestic    numeric(8,2) not null default 45 check (avg_tariff_domestic > 0),
  avg_tariff_commercial  numeric(8,2) not null default 48 check (avg_tariff_commercial > 0),
  -- LKR per exported unit. NULL = the agent doesn't value or quote exports.
  export_rate            numeric(8,2) check (export_rate is null or export_rate >= 0),
  dc_ac_ratio            numeric(4,2) not null default 1.10 check (dc_ac_ratio between 0.8 and 1.6),
  inverter_sizes_kw      numeric[] not null default '{3,5,6,8,10,12,15,20,25,30,40,50}',
  battery_unit_kwh       numeric(6,2) not null default 5.12 check (battery_unit_kwh > 0),
  battery_dod            numeric(4,3) not null default 0.900 check (battery_dod > 0 and battery_dod <= 1),
  co2_kg_per_kwh         numeric(5,3) not null default 0.700 check (co2_kg_per_kwh between 0 and 2),
  -- Prices are only ever quoted when this is on AND a range is set.
  show_prices            boolean not null default false,
  -- {"onGrid": {"min": 0, "max": 0}, "hybrid": {…}, "offGrid": {…}, "batteryPerKwh": {…}} — LKR per kWp / per kWh
  pricing                jsonb not null default '{}'::jsonb check (jsonb_typeof(pricing) = 'object'),

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.ai_agent_settings is
  'Single-row configuration for the website AI agent and its solar calculator (edited in /admin/ai-agent).';

drop trigger if exists ai_agent_settings_set_updated_at on public.ai_agent_settings;
create trigger ai_agent_settings_set_updated_at
  before update on public.ai_agent_settings
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- Knowledge base
-- -----------------------------------------------------------------------------

create table if not exists public.ai_knowledge (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 160),
  category    text not null default 'General' check (char_length(category) between 1 and 60),
  content     text not null check (char_length(content) between 1 and 12000),
  is_active   boolean not null default true,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.ai_knowledge is
  'Facts the AI agent must know beyond what it reads from the website itself. Active entries go into its instructions.';

create index if not exists ai_knowledge_active_position_idx
  on public.ai_knowledge (is_active, position);

drop trigger if exists ai_knowledge_set_updated_at on public.ai_knowledge;
create trigger ai_knowledge_set_updated_at
  before update on public.ai_knowledge
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- CRM: where a lead came from
-- -----------------------------------------------------------------------------

alter table public.leads
  add column if not exists source text not null default 'manual';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_source_check') then
    alter table public.leads
      add constraint leads_source_check check (source in ('manual', 'contact_form', 'ai_agent'));
  end if;
end $$;

comment on column public.leads.source is
  'manual (added in the CRM), contact_form (moved from Inquiries) or ai_agent (captured by the website chat).';

-- Leads converted from contact-form inquiries.
update public.leads set source = 'contact_form'
where inquiry_id is not null and source = 'manual';

-- Keeps that true for future conversions without touching convert_inquiry_to_lead().
create or replace function public.leads_default_source()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.inquiry_id is not null and new.source = 'manual' then
    new.source := 'contact_form';
  end if;
  return new;
end;
$$;

revoke execute on function public.leads_default_source() from public, anon, authenticated;

drop trigger if exists leads_default_source on public.leads;
create trigger leads_default_source
  before insert on public.leads
  for each row execute function public.leads_default_source();


-- -----------------------------------------------------------------------------
-- Conversations
-- -----------------------------------------------------------------------------

create table if not exists public.ai_chat_sessions (
  id               uuid primary key default gen_random_uuid(),
  -- The visitor's secret for this conversation. The id appears in admin URLs;
  -- the token never leaves the visitor's browser and the server.
  token            uuid not null default gen_random_uuid(),
  -- Salted, day-rotating hashes — never the raw IP — for rate limiting and
  -- "same visitor" grouping.
  visitor_hash     text,
  ip_hash          text,
  started_path     text check (started_path is null or char_length(started_path) <= 512),
  user_agent       text check (user_agent is null or char_length(user_agent) <= 400),
  first_message    text,
  message_count    int not null default 0,
  last_message_at  timestamptz,
  -- The latest solar estimate given in this conversation.
  estimate         jsonb,
  -- The CRM lead this conversation produced, once it has produced one.
  -- ON DELETE SET NULL: deleting a lead must not delete the conversation.
  lead_id          uuid references public.leads (id) on delete set null,
  contact_name     text,
  contact_phone    text,
  contact_email    text,
  created_at       timestamptz not null default now()
);

comment on table public.ai_chat_sessions is
  'One row per website AI-agent conversation. Accessed only by the server (service role) and admins.';

create index if not exists ai_chat_sessions_id_token_idx on public.ai_chat_sessions (id, token);
create index if not exists ai_chat_sessions_last_message_idx on public.ai_chat_sessions (last_message_at desc nulls last);
create index if not exists ai_chat_sessions_ip_created_idx on public.ai_chat_sessions (ip_hash, created_at desc);
create index if not exists ai_chat_sessions_lead_idx on public.ai_chat_sessions (lead_id);

create table if not exists public.ai_chat_messages (
  id          uuid primary key default gen_random_uuid(),
  -- CASCADE: a message has no meaning without its conversation.
  session_id  uuid not null references public.ai_chat_sessions (id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null check (char_length(content) between 1 and 8000),
  -- Tool activity on this turn, e.g. {"estimate": {...}, "leadCaptured": true}
  meta        jsonb,
  created_at  timestamptz not null default now()
);

comment on table public.ai_chat_messages is 'Transcript lines of website AI-agent conversations.';

create index if not exists ai_chat_messages_session_created_idx
  on public.ai_chat_messages (session_id, created_at desc);
create index if not exists ai_chat_messages_role_created_idx
  on public.ai_chat_messages (role, created_at desc);

-- Keeps the session's counters in step with its messages, atomically.
create or replace function public.ai_chat_messages_touch_session()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update public.ai_chat_sessions
     set message_count   = message_count + 1,
         last_message_at = new.created_at,
         first_message   = case
                             when first_message is null and new.role = 'user' then left(new.content, 240)
                             else first_message
                           end
   where id = new.session_id;
  return new;
end;
$$;

revoke execute on function public.ai_chat_messages_touch_session() from public, anon, authenticated;

drop trigger if exists ai_chat_messages_touch_session on public.ai_chat_messages;
create trigger ai_chat_messages_touch_session
  after insert on public.ai_chat_messages
  for each row execute function public.ai_chat_messages_touch_session();


-- -----------------------------------------------------------------------------
-- create_ai_lead(): the agent's CRM write
-- -----------------------------------------------------------------------------
-- Called by the server (service role) when a visitor agrees to be contacted.
-- Locks the conversation so two racing messages can't create two leads, and
-- returns the existing lead (duplicate = true) if this conversation already
-- has one. New leads land at the end of the default pipeline's default stage —
-- the same place inquiries moved to the CRM arrive.

create or replace function public.create_ai_lead(
  p_session_id uuid,
  p_name       text,
  p_phone      text,
  p_email      text,
  p_subject    text,
  p_notes      text
)
returns table (lead_id uuid, duplicate boolean)
language plpgsql
set search_path = public
as $$
#variable_conflict use_column
declare
  v_lead     uuid;
  v_pipeline uuid;
  v_stage    uuid;
  v_position int;
begin
  select s.lead_id into v_lead
    from public.ai_chat_sessions s
   where s.id = p_session_id
   for update;

  if not found then
    raise exception 'Unknown chat session' using errcode = 'P0002';
  end if;

  if v_lead is not null then
    return query select v_lead, true;
    return;
  end if;

  select p.id into v_pipeline
    from public.pipelines p
   order by p.is_default desc, p.position, p.created_at
   limit 1;
  if v_pipeline is null then
    raise exception 'The CRM has no pipeline yet' using errcode = 'P0002';
  end if;

  select st.id into v_stage
    from public.pipeline_stages st
   where st.pipeline_id = v_pipeline
   order by st.is_default desc, st.position, st.created_at
   limit 1;
  if v_stage is null then
    raise exception 'The default pipeline has no stages' using errcode = 'P0002';
  end if;

  select coalesce(max(l.position), -1) + 1 into v_position
    from public.leads l
   where l.stage_id = v_stage;

  insert into public.leads (pipeline_id, stage_id, name, email, phone, subject, notes, position, source)
  values (
    v_pipeline,
    v_stage,
    left(btrim(p_name), 120),
    nullif(left(btrim(coalesce(p_email, '')), 160), ''),
    left(btrim(p_phone), 40),
    nullif(left(btrim(coalesce(p_subject, '')), 200), ''),
    nullif(left(coalesce(p_notes, ''), 6000), ''),
    v_position,
    'ai_agent'
  )
  returning id into v_lead;

  update public.ai_chat_sessions
     set lead_id       = v_lead,
         contact_name  = left(btrim(p_name), 120),
         contact_phone = left(btrim(p_phone), 40),
         contact_email = nullif(left(btrim(coalesce(p_email, '')), 160), '')
   where id = p_session_id;

  return query select v_lead, false;
end;
$$;

revoke execute on function public.create_ai_lead(uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.create_ai_lead(uuid, text, text, text, text, text) to service_role;


-- -----------------------------------------------------------------------------
-- Row level security: admins only (the server uses the service role)
-- -----------------------------------------------------------------------------

alter table public.ai_agent_settings enable row level security;
alter table public.ai_knowledge      enable row level security;
alter table public.ai_chat_sessions  enable row level security;
alter table public.ai_chat_messages  enable row level security;

drop policy if exists "admins manage ai agent settings" on public.ai_agent_settings;
create policy "admins manage ai agent settings"
  on public.ai_agent_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins manage ai knowledge" on public.ai_knowledge;
create policy "admins manage ai knowledge"
  on public.ai_knowledge for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins manage ai chat sessions" on public.ai_chat_sessions;
create policy "admins manage ai chat sessions"
  on public.ai_chat_sessions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins manage ai chat messages" on public.ai_chat_messages;
create policy "admins manage ai chat messages"
  on public.ai_chat_messages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Defence in depth: Supabase's default privileges grant table access to anon;
-- RLS already blocks it, but anon needs none of these tables at all.
revoke all on public.ai_agent_settings from anon;
revoke all on public.ai_knowledge      from anon;
revoke all on public.ai_chat_sessions  from anon;
revoke all on public.ai_chat_messages  from anon;
