-- =============================================================================
-- TASKN Operations — media notes
-- Paste this entire file into the Supabase SQL Editor and run it once, after
-- 0001_init.sql. Adds standalone photo "notes" that don't require an
-- existing task/communication — just a name + category, per Bug 10.
-- =============================================================================

create table public.media_notes (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete cascade,
  storage_path text not null,
  name text not null,
  category text not null default 'General',
  caption text,
  uploaded_by uuid references public.profiles (id) on delete set null default auth.uid(),
  uploaded_at timestamptz not null default now()
);

create index media_notes_branch_id_idx on public.media_notes (branch_id);

alter table public.media_notes enable row level security;

revoke all on public.media_notes from anon, authenticated;
grant select, insert, delete on public.media_notes to authenticated;

create policy "branch members can read media notes" on public.media_notes
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can upload media notes" on public.media_notes
  for insert to authenticated
  with check (
    branch_id = (select public.get_my_branch_id())
    and uploaded_by = (select auth.uid())
  );

create policy "branch members can delete media notes" on public.media_notes
  for delete to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- Stored in the existing task-photos bucket, path = {branch_id}/media-notes/{id}.jpg
-- — no new bucket or storage policy needed: 0001_init.sql's task-photos
-- storage.objects policies already key off the first path segment
-- (branch_id) alone, which this path also satisfies.
