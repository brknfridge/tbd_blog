-- Newsletter subscribers for [tbd] Dispatches.
-- Run this once in the Supabase dashboard → SQL Editor → New query → Run.

create table if not exists public.subscribers (
  id          bigint generated always as identity primary key,
  email       text        not null,
  source      text        default 'site',
  created_at  timestamptz not null default now()
);

-- Unsubscribe support. The token is an opaque per-subscriber id used in the
-- email's unsubscribe link (never the email address itself). Adding these with
-- a default backfills any rows that already exist.
alter table public.subscribers
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
alter table public.subscribers
  add column if not exists unsubscribed_at timestamptz;

-- One row per email. Repeat signups hit this constraint and are treated as
-- "already subscribed" by the API (no error, no duplicate welcome email).
create unique index if not exists subscribers_email_key
  on public.subscribers (lower(email));

-- Row Level Security: lock the table down. The API uses the service_role key,
-- which bypasses RLS, so no policies are needed for inserts to work. With RLS
-- on and no policies, the public anon key can read/write nothing.
alter table public.subscribers enable row level security;

-- Matchle leads: people who asked us to reach out with potential matches.
-- Written only by /api/matchle-lead with the service_role key.
create table if not exists public.matchle_leads (
  id           bigint generated always as identity primary key,
  name         text        not null,
  email        text        not null,
  phone        text        not null,
  brief        text,                 -- the Matchle query string, e.g. sex=f&aMin=25&city=pune
  city         text,
  looking_for  text,
  matches      integer,
  weeks        integer,
  created_at   timestamptz not null default now()
);

create index if not exists matchle_leads_email_idx on public.matchle_leads (lower(email));

-- Same lockdown as subscribers: RLS on, no policies, so the anon key sees nothing.
alter table public.matchle_leads enable row level security;

-- Unsubscribe link for the Matchle follow-up email (same pattern as subscribers).
alter table public.matchle_leads
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
alter table public.matchle_leads
  add column if not exists unsubscribed_at timestamptz;
