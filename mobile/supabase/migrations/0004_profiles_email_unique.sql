-- =============================================================================
-- TASKN Operations — enforce one profile row per email
-- Paste this entire file into the Supabase SQL Editor and run it once, after
-- 0001-0003.
--
-- Context: `profiles.email` had no uniqueness guarantee at the schema level.
-- `auth.users.email` already has Supabase's own uniqueness protections for
-- confirmed accounts, but this adds the same guarantee directly on the table
-- our own app reads/writes, so two profile rows can never end up sharing an
-- email under any code path — including a future bug in the signup trigger.
--
-- If this fails with "duplicate key value violates unique constraint", it
-- means duplicate profile rows already exist for the same email. Find them
-- first with:
--   select email, array_agg(id) from public.profiles group by email having count(*) > 1;
-- then decide which row per email to keep before re-running this migration.
-- =============================================================================

alter table public.profiles
  add constraint profiles_email_unique unique (email);
