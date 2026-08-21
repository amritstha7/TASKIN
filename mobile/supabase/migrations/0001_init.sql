-- =============================================================================
-- TASKN Operations — initial schema
-- Paste this entire file into the Supabase SQL Editor and run it once.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / ON CONFLICT
-- where practical, but this is designed as a single fresh-project migration,
-- not an idempotent upgrade script.
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- 1. TABLES
-- =============================================================================

-- A branch/store. All shared data (tasks, communications, activity log) is
-- scoped to a branch, not to an individual user — this is a shared team
-- workspace, not a single-player app.
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Case/whitespace-insensitive uniqueness so "Metro Central" and "metro central "
-- resolve to the same branch during signup's find-or-create.
create unique index branches_name_normalized_idx on public.branches (lower(btrim(name)));

-- One row per auth.users row. `role` is a free-text job title (e.g. "Store
-- Operations Lead") — there is no permission/RBAC concept in this app, it is
-- purely a display label, matching the original web app.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  branch_id uuid not null references public.branches (id) on delete restrict,
  name text not null,
  email text not null,
  role text not null default 'Store Associate',
  avatar_url text,
  joined_date date not null default current_date,
  theme text not null default 'auto' check (theme in ('auto', 'light', 'dark')),
  language text not null default 'English' check (language in ('English', 'Nepali', 'Spanish', 'French')),
  calendar_mode text not null default 'dual' check (calendar_mode in ('ad', 'bs', 'dual')),
  push_notifications boolean not null default true,
  daily_summary boolean not null default true,
  sound_vibration boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_branch_id_idx on public.profiles (branch_id);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'General Ops',
  due_date date not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  repeat text not null default 'none' check (repeat in ('none', 'daily', 'weekly', 'monthly')),
  is_urgent boolean not null default false,
  notifications_enabled boolean not null default true,
  notifications_timing text not null default '15m' check (notifications_timing in ('15m', '30m', '1h', '1d')),
  snoozed_until timestamptz,
  completed boolean not null default false,
  completed_by uuid references public.profiles (id) on delete set null,
  completed_at timestamptz,
  attachment_name text,
  attachment_url text,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_branch_id_idx on public.tasks (branch_id);
create index tasks_branch_due_date_idx on public.tasks (branch_id, due_date);
create index tasks_branch_completed_idx on public.tasks (branch_id, completed);

create table public.task_notes (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  branch_id uuid not null, -- populated by trigger from the parent task, never by the client
  author_id uuid references public.profiles (id) default auth.uid(),
  body text not null check (char_length(body) > 0),
  created_at timestamptz not null default now()
);

create index task_notes_task_id_idx on public.task_notes (task_id);

create table public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  branch_id uuid not null, -- populated by trigger from the parent task
  storage_path text not null,
  name text,
  caption text,
  uploaded_by uuid references public.profiles (id) default auth.uid(),
  uploaded_at timestamptz not null default now()
);

create index task_photos_task_id_idx on public.task_photos (task_id);

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete cascade,
  title text not null,
  description text not null default '',
  due_date date not null,
  attachment_name text,
  attachment_url text,
  attachment_size_bytes bigint,
  is_completed boolean not null default false,
  completed_by uuid references public.profiles (id) on delete set null,
  completed_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index communications_branch_id_idx on public.communications (branch_id);
create index communications_branch_completed_idx on public.communications (branch_id, is_completed);

create table public.communication_notes (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid not null references public.communications (id) on delete cascade,
  branch_id uuid not null, -- populated by trigger from the parent communication
  author_id uuid references public.profiles (id) default auth.uid(),
  body text not null check (char_length(body) > 0),
  created_at timestamptz not null default now()
);

create index communication_notes_communication_id_idx on public.communication_notes (communication_id);

create table public.communication_photos (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid not null references public.communications (id) on delete cascade,
  branch_id uuid not null, -- populated by trigger from the parent communication
  storage_path text not null,
  name text,
  caption text,
  uploaded_by uuid references public.profiles (id) default auth.uid(),
  uploaded_at timestamptz not null default now()
);

create index communication_photos_communication_id_idx on public.communication_photos (communication_id);

-- Personal notes ("My Tasks & Notes") are the one table that is NOT
-- branch-shared — private to the author, exactly like the original app.
create table public.personal_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  text text not null check (char_length(text) > 0),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index personal_notes_user_id_idx on public.personal_notes (user_id);

-- Shared, branch-wide audit log. Populated exclusively by triggers (see
-- section 3) so it can never drift from the real data and can never be
-- forged by a client claiming a false actor/timestamp. Personal notes are
-- deliberately excluded from entity_type — the original web app leaked a
-- preview of private note text into this shared feed, which this schema
-- fixes by construction.
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  entity_type text not null check (entity_type in ('task', 'communication')),
  task_id uuid references public.tasks (id) on delete set null,
  communication_id uuid references public.communications (id) on delete set null,
  type text not null check (type in ('created', 'updated', 'completed', 'snoozed', 'note_added')),
  title text not null,
  description text not null default '',
  status_badge text,
  created_at timestamptz not null default now()
);

create index activities_branch_created_idx on public.activities (branch_id, created_at desc);

-- =============================================================================
-- 2. HELPER FUNCTIONS
-- =============================================================================

-- SECURITY DEFINER + stable: safely reads the caller's own branch_id without
-- recursing into profiles' own RLS policy (a plain subquery inside a
-- profiles policy would re-trigger that same policy).
create or replace function public.get_my_branch_id()
returns uuid
language sql
security definer
stable
set search_path = ''
as $$
  select branch_id from public.profiles where id = auth.uid()
$$;

grant execute on function public.get_my_branch_id() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- =============================================================================
-- 3. TRIGGERS
-- =============================================================================

-- --- updated_at bookkeeping ---------------------------------------------------
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger trg_communications_updated_at before update on public.communications
  for each row execute function public.set_updated_at();

-- --- prevent a client from re-assigning their own branch via UPDATE ----------
create or replace function public.protect_profile_branch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.branch_id is distinct from old.branch_id then
    new.branch_id := old.branch_id;
  end if;
  return new;
end;
$$;

create trigger trg_protect_profile_branch before update on public.profiles
  for each row execute function public.protect_profile_branch();

-- --- populate branch_id on child rows from their parent -----------------------
create or replace function public.set_task_child_branch_id()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select branch_id into new.branch_id from public.tasks where id = new.task_id;
  if new.branch_id is null then
    raise exception 'Task % not found', new.task_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_communication_child_branch_id()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select branch_id into new.branch_id from public.communications where id = new.communication_id;
  if new.branch_id is null then
    raise exception 'Communication % not found', new.communication_id;
  end if;
  return new;
end;
$$;

create trigger trg_task_photos_branch_id before insert on public.task_photos
  for each row execute function public.set_task_child_branch_id();
create trigger trg_communication_photos_branch_id before insert on public.communication_photos
  for each row execute function public.set_communication_child_branch_id();

-- --- notes: populate branch_id AND log the "note_added" activity (one
--     atomic trigger, same transaction as the insert) --------------------------
create or replace function public.handle_task_note_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_branch_id uuid;
  v_task_title text;
begin
  select branch_id, title into v_branch_id, v_task_title from public.tasks where id = new.task_id;
  if v_branch_id is null then
    raise exception 'Task % not found', new.task_id;
  end if;

  new.branch_id := v_branch_id;

  insert into public.activities (branch_id, actor_id, entity_type, task_id, type, title, description)
  values (
    v_branch_id,
    coalesce(new.author_id, auth.uid()),
    'task',
    new.task_id,
    'note_added',
    v_task_title,
    'Note added: "' || left(new.body, 60) || case when char_length(new.body) > 60 then '...' else '' end || '"'
  );

  return new;
end;
$$;

create or replace function public.handle_communication_note_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_branch_id uuid;
  v_comm_title text;
begin
  select branch_id, title into v_branch_id, v_comm_title from public.communications where id = new.communication_id;
  if v_branch_id is null then
    raise exception 'Communication % not found', new.communication_id;
  end if;

  new.branch_id := v_branch_id;

  insert into public.activities (branch_id, actor_id, entity_type, communication_id, type, title, description)
  values (
    v_branch_id,
    coalesce(new.author_id, auth.uid()),
    'communication',
    new.communication_id,
    'note_added',
    v_comm_title,
    'Note added: "' || left(new.body, 60) || case when char_length(new.body) > 60 then '...' else '' end || '"'
  );

  return new;
end;
$$;

create trigger trg_task_notes_before_insert before insert on public.task_notes
  for each row execute function public.handle_task_note_insert();
create trigger trg_communication_notes_before_insert before insert on public.communication_notes
  for each row execute function public.handle_communication_note_insert();

-- --- tasks / communications: log created / completed / reopened / snoozed ----
create or replace function public.log_task_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (branch_id, actor_id, entity_type, task_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'task', new.id, 'created', new.title,
      'Task created in category "' || new.category || '".', 'Created');
    return new;
  end if;

  if old.completed = false and new.completed = true then
    insert into public.activities (branch_id, actor_id, entity_type, task_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'task', new.id, 'completed', new.title,
      'Task marked as completed.', 'Completed');
  elsif old.completed = true and new.completed = false then
    insert into public.activities (branch_id, actor_id, entity_type, task_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'task', new.id, 'updated', new.title,
      'Task reopened for further action.', 'Updated');
  elsif old.snoozed_until is distinct from new.snoozed_until and new.snoozed_until is not null then
    insert into public.activities (branch_id, actor_id, entity_type, task_id, type, title, description)
    values (new.branch_id, auth.uid(), 'task', new.id, 'snoozed', new.title, 'Reminder snoozed.');
  elsif (old.title, old.description, old.category, old.due_date, old.priority, old.is_urgent)
        is distinct from
        (new.title, new.description, new.category, new.due_date, new.priority, new.is_urgent) then
    insert into public.activities (branch_id, actor_id, entity_type, task_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'task', new.id, 'updated', new.title, 'Task details updated.', 'Updated');
  end if;

  return new;
end;
$$;

create or replace function public.log_communication_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (branch_id, actor_id, entity_type, communication_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'communication', new.id, 'created', new.title,
      'Communication received.', 'Created');
    return new;
  end if;

  if old.is_completed = false and new.is_completed = true then
    insert into public.activities (branch_id, actor_id, entity_type, communication_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'communication', new.id, 'completed', new.title,
      'Communication confirmed and signed off.', 'Completed');
  elsif old.is_completed = true and new.is_completed = false then
    insert into public.activities (branch_id, actor_id, entity_type, communication_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'communication', new.id, 'updated', new.title,
      'Communication marked pending.', 'Updated');
  elsif (old.title, old.description, old.due_date) is distinct from (new.title, new.description, new.due_date) then
    insert into public.activities (branch_id, actor_id, entity_type, communication_id, type, title, description, status_badge)
    values (new.branch_id, auth.uid(), 'communication', new.id, 'updated', new.title,
      'Communication details updated.', 'Updated');
  end if;

  return new;
end;
$$;

create trigger trg_tasks_activity after insert or update on public.tasks
  for each row execute function public.log_task_activity();
create trigger trg_communications_activity after insert or update on public.communications
  for each row execute function public.log_communication_activity();

-- --- signup: find-or-create the branch, then create the profile --------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_branch_name text;
  v_branch_id uuid;
  v_name text;
  v_role text;
begin
  v_branch_name := btrim(coalesce(new.raw_user_meta_data ->> 'branch_name', 'Unassigned Branch'));
  if v_branch_name = '' then
    v_branch_name := 'Unassigned Branch';
  end if;
  v_name := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1));
  v_role := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'role'), ''), 'Store Associate');

  select id into v_branch_id from public.branches where lower(btrim(name)) = lower(v_branch_name);

  if v_branch_id is null then
    insert into public.branches (name) values (v_branch_name)
    on conflict ((lower(btrim(name)))) do nothing
    returning id into v_branch_id;

    if v_branch_id is null then
      select id into v_branch_id from public.branches where lower(btrim(name)) = lower(v_branch_name);
    end if;
  end if;

  insert into public.profiles (id, branch_id, name, email, role)
  values (new.id, v_branch_id, v_name, new.email, v_role);

  return new;
end;
$$;

create trigger trg_on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 4. ROW LEVEL SECURITY
-- =============================================================================

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_notes enable row level security;
alter table public.task_photos enable row level security;
alter table public.communications enable row level security;
alter table public.communication_notes enable row level security;
alter table public.communication_photos enable row level security;
alter table public.personal_notes enable row level security;
alter table public.activities enable row level security;

-- Don't rely on whatever default grants a project happens to ship with —
-- revoke everything, then grant back exactly what each role needs. `anon`
-- gets nothing except reading branch names (needed for the signup
-- typeahead, before an account/session exists); every other operation
-- requires an authenticated session, further narrowed by the RLS policies
-- below.
revoke all on public.branches, public.profiles, public.tasks, public.task_notes,
  public.task_photos, public.communications, public.communication_notes,
  public.communication_photos, public.personal_notes, public.activities
  from anon, authenticated;

grant select on public.branches to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert on public.task_notes to authenticated;
grant select, insert, delete on public.task_photos to authenticated;
grant select, insert, update, delete on public.communications to authenticated;
grant select, insert on public.communication_notes to authenticated;
grant select, insert, delete on public.communication_photos to authenticated;
grant select, insert, update, delete on public.personal_notes to authenticated;
grant select on public.activities to authenticated;

-- --- branches ------------------------------------------------------------
create policy "anyone can read branch names" on public.branches
  for select to anon, authenticated using (true);

-- --- profiles --------------------------------------------------------------
create policy "branch members can read profiles" on public.profiles
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "users can update their own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- --- tasks -------------------------------------------------------------------
create policy "branch members can read tasks" on public.tasks
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can create tasks" on public.tasks
  for insert to authenticated
  with check (branch_id = (select public.get_my_branch_id()));

create policy "branch members can update tasks" on public.tasks
  for update to authenticated
  using (branch_id = (select public.get_my_branch_id()))
  with check (branch_id = (select public.get_my_branch_id()));

create policy "branch members can delete tasks" on public.tasks
  for delete to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- --- task_notes (append-only) -------------------------------------------------
create policy "branch members can read task notes" on public.task_notes
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can add task notes" on public.task_notes
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.tasks t
      where t.id = task_id and t.branch_id = (select public.get_my_branch_id())
    )
  );

-- --- task_photos ---------------------------------------------------------------
create policy "branch members can read task photos" on public.task_photos
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can upload task photos" on public.task_photos
  for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and exists (
      select 1 from public.tasks t
      where t.id = task_id and t.branch_id = (select public.get_my_branch_id())
    )
  );

create policy "branch members can delete task photos" on public.task_photos
  for delete to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- --- communications --------------------------------------------------------
create policy "branch members can read communications" on public.communications
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can create communications" on public.communications
  for insert to authenticated
  with check (branch_id = (select public.get_my_branch_id()));

create policy "branch members can update communications" on public.communications
  for update to authenticated
  using (branch_id = (select public.get_my_branch_id()))
  with check (branch_id = (select public.get_my_branch_id()));

create policy "branch members can delete communications" on public.communications
  for delete to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- --- communication_notes (append-only) -----------------------------------------
create policy "branch members can read communication notes" on public.communication_notes
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can add communication notes" on public.communication_notes
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.communications c
      where c.id = communication_id and c.branch_id = (select public.get_my_branch_id())
    )
  );

-- --- communication_photos ------------------------------------------------------
create policy "branch members can read communication photos" on public.communication_photos
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

create policy "branch members can upload communication photos" on public.communication_photos
  for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and exists (
      select 1 from public.communications c
      where c.id = communication_id and c.branch_id = (select public.get_my_branch_id())
    )
  );

create policy "branch members can delete communication photos" on public.communication_photos
  for delete to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- --- personal_notes (strictly private, owner-only) ------------------------------
create policy "users can read their own notes" on public.personal_notes
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "users can create their own notes" on public.personal_notes
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "users can update their own notes" on public.personal_notes
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "users can delete their own notes" on public.personal_notes
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- --- activities (read-only for clients; writes happen only via SECURITY
--     DEFINER triggers owned by the migration role, which bypass RLS) ---------
create policy "branch members can read activity" on public.activities
  for select to authenticated
  using (branch_id = (select public.get_my_branch_id()));

-- =============================================================================
-- 5. TOP PERFORMERS VIEW
-- =============================================================================

-- security_invoker is load-bearing: without it this view would run with the
-- view owner's privileges and leak every branch's completion data to every
-- caller. With it, the query inherits the caller's own session, so the
-- branch-scoped RLS already on profiles/tasks naturally restricts the join
-- to the caller's own branch — no extra bypass needed.
create view public.top_performers
with (security_invoker = true) as
select
  p.id as profile_id,
  p.branch_id,
  p.name,
  p.role,
  p.avatar_url,
  count(t.id) filter (where t.completed) as task_count,
  rank() over (
    partition by p.branch_id
    order by count(t.id) filter (where t.completed) desc
  ) as rank
from public.profiles p
left join public.tasks t on t.completed_by = p.id and t.branch_id = p.branch_id
group by p.id, p.branch_id, p.name, p.role, p.avatar_url;

grant select on public.top_performers to authenticated;

-- =============================================================================
-- 6. STORAGE BUCKETS + POLICIES
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('task-photos', 'task-photos', false),
  ('communication-attachments', 'communication-attachments', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- task-photos: private, path = {branch_id}/{task_id}/{photo_id}.jpg
create policy "branch members can view task photo files" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'task-photos'
    and (storage.foldername(name))[1]::uuid = (select public.get_my_branch_id())
  );

create policy "branch members can upload task photo files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'task-photos'
    and (storage.foldername(name))[1]::uuid = (select public.get_my_branch_id())
  );

create policy "branch members can delete task photo files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'task-photos'
    and (storage.foldername(name))[1]::uuid = (select public.get_my_branch_id())
  );

-- communication-attachments: private, path = {branch_id}/{communication_id}/{filename}
create policy "branch members can view communication files" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'communication-attachments'
    and (storage.foldername(name))[1]::uuid = (select public.get_my_branch_id())
  );

create policy "branch members can upload communication files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'communication-attachments'
    and (storage.foldername(name))[1]::uuid = (select public.get_my_branch_id())
  );

create policy "branch members can delete communication files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'communication-attachments'
    and (storage.foldername(name))[1]::uuid = (select public.get_my_branch_id())
  );

-- avatars: public read (low-sensitivity, displayed constantly across the
-- branch), path = {user_id}/avatar.jpg, write restricted to the owning user
create policy "anyone can view avatars" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'avatars');

create policy "users can upload their own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "users can replace their own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "users can delete their own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- =============================================================================
-- Done. Next steps:
--   1. In Authentication → Providers → Email, decide whether to keep
--      "Confirm email" on (recommended for production) or turn it off for
--      faster local testing (signup logs the user in immediately either way
--      once toggled off).
--   2. Copy your Project URL and anon public key into mobile/.env.
-- =============================================================================
