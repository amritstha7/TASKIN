# TASKN — Mobile (Expo + Supabase)

Cross-platform (iOS + Android) React Native port of the TASKN Operations web prototype, backed by a real Supabase project (Postgres + RLS + Storage + Auth) instead of `localStorage`. This is a **shared team workspace**: every staff member at the same store/branch sees and can act on the same tasks, communications, and activity feed. Personal notes ("My Tasks & Notes") stay private per user.

The web app under `../src` is untouched — this is a completely separate project.

## 1. Execution plan / navigation structure

```
src/app/
  _layout.tsx                 Root providers + Stack (declares modal presentations)
  index.tsx                   Redirect based on auth session

  (auth)/                     Stack — login, signup, reset-password
  (tabs)/                     Tabs — dashboard, activity, add-task*, media, settings/*
  tasks/urgent.tsx            Full urgent-task list (pushed from dashboard)
  tasks/store.tsx             Full general-task list (pushed from dashboard)
  communications/index.tsx    Communications list
  notes.tsx                   Personal notes (private per user)
  update-password.tsx         Reached only via the password-recovery deep link

  modals/                     presentation: 'modal'
    add-task.tsx, edit-profile.tsx, export-report.tsx, legend.tsx,
    photo-proof/[taskId].tsx, photo-preview.tsx, attachment/[commId].tsx
```

`*` the center "Add Task" tab button intercepts its own press and pushes `/modals/add-task` instead of switching tabs.

Data layer: one TanStack Query hook per entity (`src/hooks/use-*.ts`), each backed by Supabase Realtime so one teammate's change shows up live on another's phone. Auth/session, i18n (English/Nepali/Spanish/French), theme, and calendar-mode (AD/BS/Dual) live in `src/providers/`.

## 2. Database schema

Full schema lives in **`supabase/migrations/0001_init.sql`** — copy that entire file into the Supabase SQL Editor and run it once. It creates:

- `branches`, `profiles` (1:1 with `auth.users`), `tasks`, `task_notes`, `task_photos`, `communications`, `communication_notes`, `communication_photos`, `personal_notes`, `activities`
- A `top_performers` view (branch leaderboard by completed-task count)
- RLS on every table: branch-scoped for shared data, owner-scoped for `personal_notes`, read-only for `activities` (written exclusively by triggers)
- Triggers for signup (find-or-create branch → create profile), `updated_at` bookkeeping, and audit-log entries
- 3 Storage buckets: `task-photos` (private), `communication-attachments` (private), `avatars` (public)

See the comments at the top and bottom of that file for the two manual follow-up steps (email confirmation setting, `.env` values).

## 3. Setup

```bash
cd mobile
npm install
```

1. **Run the SQL migration** — paste `supabase/migrations/0001_init.sql` into your Supabase project's SQL Editor and run it. This also creates the 3 storage buckets and their policies.
2. **Environment** — `.env` already has this project's URL/anon key (copied from the repo root's `.env`). To point at a different Supabase project, edit `.env` (see `.env.example` for the required keys: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
3. **Auth email settings** — in the Supabase dashboard under Authentication → Providers → Email, decide whether to keep "Confirm email" on (recommended for production) or turn it off for faster local testing.
4. **Password-reset deep link** — under Authentication → URL Configuration, add `taskn://reset-password` to the Redirect URLs allow-list so the "forgot password" email link can hand off back into the app.

## 4. Run it

```bash
npx expo start
```

From the terminal output:
- Press `i` for the **iOS Simulator**, `a` for the **Android Emulator** (both require Xcode / Android Studio installed).
- Or scan the QR code with the **Expo Go** app on a physical device.

First run: sign up with a name, email, password, and a store/branch name (a typeahead suggests existing branches so teammates land in the same workspace). Everything after that — tasks, communications, notes, media, activity — is live against Supabase.

**Note on `expo-notifications`**: local task-reminder scheduling works in Expo Go, but for the most reliable experience (and required for any future remote push) use a development build (`npx expo run:ios` / `npx expo run:ios`).

## 5. What's intentionally different from the web prototype

- **Real auth + shared branch workspace** instead of a single `localStorage` blob — see the Context section of the original plan for why (the demo data itself showed multiple staff completing each other's tasks).
- Personal notes never leak into the shared activity feed (the original had this bug).
- Calendar's Bikram Sambat conversion uses the `nepali-date-converter` package instead of a hand-rolled table limited to ~2020–2029.
- Photo capture/upload, PDF/CSV/JSON export, and the audio chime are all real (`expo-image-picker`, `expo-print`, `expo-file-system`, `expo-sharing`, `expo-audio`, `expo-haptics`) — the web prototype either faked or only partially implemented these.
- "Clear Local Cache" now only clears the on-device query cache — it can no longer wipe server data (the web version's "clear" really did reset everything to mock data).
