-- =============================================================================
-- TASKN Operations — per-occurrence completion for recurring tasks
-- Paste this entire file into the Supabase SQL Editor and run it once, after
-- 0001_init.sql and 0002_media_notes.sql.
--
-- Problem: `tasks.completed` is a single boolean per row. That's correct for
-- a one-off task (repeat = 'none'), which only ever has one due date — but a
-- recurring task (daily/weekly/monthly) is "due" again on every matching
-- future date, and completing it on one occurrence must not complete (or
-- affect) any other occurrence. This table tracks completion per
-- (task, calendar date) instead of a single global flag.
-- =============================================================================

create table public.task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  branch_id uuid not null, -- populated by trigger from the parent task, never by the client
  completed_date date not null,
  completed_by uuid references public.profiles (id) on delete set null default auth.uid(),
  completed_at timestamptz not null default now(),
  unique (task_id, completed_date)
);

create index task_completions_task_id_idx on public.task_completions (task_id);
create index task_completions_branch_id_idx on public.task_completions (branch_id);

alter table public.task_completions enable row level security;

revoke all on public.task_completions from anon, authenticated;
grant select, insert, delete on public.task_completions to authenticated;

-- Reuses the exact same branch_id-population pattern as task_notes/task_photos.
create trigger trg_task_completions_branch_id before insert on public.task_completions
  for each row execute function public.set_task_child_branch_id();

create policy "branch members can read task completions" on public.task_completions
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can mark a task occurrence complete" on public.task_completions
  for insert to authenticated
  with check (
    completed_by = (select auth.uid())
    and exists (
      select 1 from public.tasks t
      where t.id = task_id and t.branch_id = (select public.get_my_branch_id())
    )
  );

-- Uncompleting an occurrence removes the row (matches how the client toggles
-- completion — any branch-mate can do this, same as the rest of this
-- shared-workspace RLS model).
create policy "branch members can unmark a task occurrence" on public.task_completions
  for delete to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- =============================================================================
-- Done. task_completions only matters for tasks with repeat <> 'none' — the
-- client is responsible for reading tasks.completed directly for repeat =
-- 'none' tasks, and consulting this table (by completed_date) for recurring
-- ones. Nothing here changes existing tasks.completed / task_photos /
-- task_notes behavior for one-off tasks.
-- =============================================================================
