-- Newsletter subscribers for [tbd] Dispatches.
-- Run this once in the Supabase dashboard → SQL Editor → New query → Run.

create table if not exists public.subscribers (
  id          bigint generated always as identity primary key,
  email       text        not null,
  source      text        default 'site',
  created_at  timestamptz not null default now()
);

-- One row per email. Repeat signups hit this constraint and are treated as
-- "already subscribed" by the API (no error, no duplicate welcome email).
create unique index if not exists subscribers_email_key
  on public.subscribers (lower(email));

-- Row Level Security: lock the table down. The API uses the service_role key,
-- which bypasses RLS, so no policies are needed for inserts to work. With RLS
-- on and no policies, the public anon key can read/write nothing.
alter table public.subscribers enable row level security;
