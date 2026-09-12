# IEEE MIT Bengaluru — Website

The official website and content platform for IEEE MIT Bengaluru — the epicenter
for all society events, articles, and activities. Built as a production-grade,
type-safe base for the full official site.

## Stack

| Layer      | Technology                                                |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19                        |
| Language   | TypeScript (strict)                                       |
| Styling    | Tailwind CSS v4                                            |
| Database   | Supabase Postgres, accessed via **Drizzle ORM** (server)  |
| Auth       | Supabase Auth (`@supabase/ssr`), role-based admin          |
| Storage    | Supabase Storage (image uploads)                          |
| Validation | Zod                                                       |
| Tests      | Vitest (unit) + Playwright (e2e)                          |
| CI         | GitHub Actions                                            |

## Architecture

- **No client-side database access.** The browser never talks to the database.
  All reads/writes go through a server layer:
  - `db/` — Drizzle schema (`db/schema/*`), client (`db/client.ts`), migrations
    (`drizzle/`), and seed (`db/seed.ts`).
  - `lib/data/*` — the **repository layer**; the only place Drizzle queries live.
    Called from Server Components and Route Handlers.
  - `lib/validations/*` — Zod input schemas (forms/queries).
  - `lib/actions/*` — `'use server'` mutations. Each one: `assertAdmin()` →
    Zod parse → repository write → `revalidatePath()` → redirect.
- **Auth & admin.** `@supabase/ssr` browser/server client split
  (`lib/supabase/*`), session refresh + coarse gating in `proxy.ts`, and
  defense-in-depth role checks: `proxy.ts` → admin layout `requireAdmin()` →
  per-action `assertAdmin()` → Postgres **RLS** (`drizzle/0001_*`).
- **Public pages** (`app/(public)/*`) are Server Components that read the
  repository directly and render dynamically. Filtering/pagination is real,
  server-side `LIMIT/OFFSET` driven by the URL query string.
- **Admin dashboard** (`app/admin/*`) — login at `/admin/login`; the guarded
  dashboard under the `(dashboard)` route group provides CRUD for events,
  articles, societies (+ members), team, announcements, and an inbox.
- **Societies** are data-driven: one dynamic route `app/(public)/societies/[slug]`
  replaces the former 10 near-identical pages.

```
app/
  (public)/            # public site (Navbar + Footer layout)
    page.tsx           # home
    events/  articles/  membership/  societies/  societies/[slug]/
  admin/
    login/             # /admin/login (ungated)
    (dashboard)/       # guarded: requireAdmin() in layout
      page.tsx events/ articles/ societies/ team/ announcements/ inbox/
  auth/                # callback + signout route handlers
components/{public,admin}/
db/{client.ts,schema/,seed.ts}     drizzle/     # migrations
lib/{env,site-config,utils,storage}.ts
lib/{data,validations,actions,auth,supabase}/
tests/{unit,e2e}/
```

## Getting started

You have two options for the database:

- **Local Supabase (recommended for development)** — everything runs in Docker
  on your machine. Nothing touches the production project, and you can reset it
  freely. Requires Docker Desktop.
- **A cloud Supabase project** — what production uses.

### 1. Prerequisites

- Node.js ≥ 20.9
- Docker Desktop (only for the local-Supabase route)
- A Supabase project (only for the cloud route)

### 2. Install

```bash
npm install
```

### 3a. Local development (Docker)

Start the local Supabase stack. The `-x` flags skip services this app does not
use, which makes the first run much faster:

```bash
npx supabase start -x studio,edge-runtime,realtime,logflare,vector,supavisor,imgproxy,mailpit
```

It prints a `DB_URL`, `API_URL`, `ANON_KEY` and `SERVICE_ROLE_KEY`. Copy
`.env.example` to `.env.local` and fill them in:

| Variable                        | Local value                                          |
| ------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL` / `DIRECT_URL`   | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL`      | `http://127.0.0.1:54321`                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the printed `ANON_KEY`                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | the printed `SERVICE_ROLE_KEY`                       |
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000`                              |

Then set up the schema and data:

```bash
npm run db:migrate   # applies drizzle/ migrations (schema + RLS + auth wiring)
npm run db:seed      # societies, leadership, CIS members, sample events/articles
```

The migrations do **not** create the Storage bucket. Create it once:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('media','media',true)
  ON CONFLICT (id) DO NOTHING;
```

Stop the stack with `npx supabase stop` (add `--no-backup` to discard the data).

### 3b. Cloud Supabase project

Copy `.env.example` to `.env.local` and fill in the values from the dashboard:

| Variable                        | Where to find it (Supabase dashboard)                          |
| ------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                  | Database → Connection string → **Transaction pooler** (6543)   |
| `DIRECT_URL`                    | Database → Connection string → **Direct connection** (5432)    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Project Settings → API → `service_role` (secret)               |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project Settings → API → Project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → `anon` public key                     |
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000` for local dev, else the real origin    |

`DATABASE_URL` **must** be the transaction pooler (6543). `db/client.ts` sets
`prepare: false` for exactly that, and a direct connection will exhaust its
connection limit under serverless.

For a **fresh** project, the fastest setup is the one-shot script: open
Supabase → SQL Editor and run [`drizzle/full_setup.sql`](drizzle/full_setup.sql).
It creates the schema, RLS, auth wiring, the `media` Storage bucket and the seed
data in a single run — no `db:migrate`/`db:seed` needed.

Use `npm run db:migrate` + `npm run db:seed` instead when you are applying
*incremental* changes to a database that already exists.

### 4. Grant admin access

> **Having an account is not enough.** Write access is controlled by the
> `app_admins` allowlist table (`drizzle/0003_admin_allowlist.sql`). A trigger
> promotes a profile to `admin` when its email is added and demotes it to
> `viewer` when removed, so the allowlist is the single source of truth.
> Editing `profiles.role` directly is not the supported path — a
> `prevent_role_escalation` trigger guards that column.

The branch's technical account is seeded by `full_setup.sql` and `db:seed`,
so a fresh database already grants it. To add anyone else:

1. Add the email to the allowlist (Supabase → SQL Editor):

   ```sql
   INSERT INTO public.app_admins (email, note)
   VALUES ('someone@example.com', 'who they are')
   ON CONFLICT (email) DO NOTHING;
   ```

2. Create the user: Supabase → Authentication → **Add user**, ticking
   *Auto Confirm User*. The signup trigger reads the allowlist and assigns the
   `admin` role automatically.

To revoke access later, `DELETE FROM public.app_admins WHERE email = '…';` —
the account drops to a read-only viewer immediately.

### 5. Run

```bash
npm run dev          # http://localhost:3000  (admin at /admin/login)
```

## Scripts

| Script                | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Dev server                               |
| `npm run build`       | Production build                         |
| `npm run start`       | Run the production build                 |
| `npm run lint`        | ESLint                                   |
| `npm run typecheck`   | `tsc --noEmit`                           |
| `npm run format`      | Prettier write                           |
| `npm test`            | Vitest unit tests                        |
| `npm run test:e2e`    | Playwright e2e (needs a seeded DB)       |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate`  | Apply migrations                         |
| `npm run db:seed`     | Seed the database                        |
| `npm run db:studio`   | Drizzle Studio                           |

## Deployment

Deploy to Vercel (or any Node host). Every route is server-rendered on demand,
so a static host (GitHub Pages, Netlify's static mode) will **not** work.

1. Set up the database on the production Supabase project — see **3b** above.
2. Import the repo in Vercel and set every variable from `.env.example` in
   Project Settings → Environment Variables.
3. Create the auth user for the seeded admin address — see **4** above. The
   allowlist grants the role, but the account itself must still be created in
   Supabase → Authentication → Add user before anyone can sign in.
4. Supabase → Authentication → **URL Configuration**: set the Site URL to the
   production origin and add `https://<your-domain>/auth/callback` to the
   Redirect URLs, or `app/auth/callback/route.ts` will reject logins.

`NEXT_PUBLIC_SUPABASE_URL` must be present **at build time**, not only at
runtime: `next.config.ts` derives the `next/image` allowlist host from it, so a
missing value at build silently breaks optimization of uploaded images.

## Maintenance

### Keeping dependencies healthy

```bash
npm audit                     # check for advisories
npm outdated                  # check for newer releases
```

Next.js in particular ships security fixes often; this app's `proxy.ts` admin
gate and Server Actions have both been affected by past advisories, so treat a
Next.js advisory as urgent. Bump the pinned version in `package.json`, run
`npm install`, then `npm run lint && npm run typecheck && npm test && npm run build`
before deploying.

`drizzle-kit` pulls in a deprecated `@esbuild-kit/*` chain that reports moderate
advisories with no upstream fix. It is a CLI used for migrations only — it never
runs in production or in a browser.

### Changing the database schema

Schema lives in `db/schema/*`. After editing it:

```bash
npm run db:generate   # writes a new numbered migration into drizzle/
npm run db:migrate    # applies it
```

Never edit an already-applied migration — add a new one. `drizzle/full_setup.sql`
is a convenience snapshot for fresh projects and must be updated by hand when
the schema changes.

### Tests

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright; needs a running, seeded database
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests and a build
against placeholder env vars. It does **not** run the e2e suite, because that
needs a live database — run it locally before releasing.

### Troubleshooting

| Symptom | Cause |
| --- | --- |
| `Invalid environment variables` on boot | `.env.local` missing or incomplete — `lib/env.ts` validates on load and fails fast. |
| Pages render but images 404 | The `media` Storage bucket does not exist, or is not public. |
| Signed in, but `/admin` bounces to login | The email is not in `app_admins`. See **4**. |
| `Port 3000 is in use` | A previous `next dev` survived; kill the stray Node process. |
| VS Code flags `Unknown at rule @theme` | Install the recommended Tailwind extension; `.vscode/settings.json` already silences the built-in CSS linter. |

## Security

- **Writes never come from the browser.** `drizzle/0002_lockdown_writes.sql`
  revokes INSERT/UPDATE/DELETE from `anon` and `authenticated` on every table,
  so the publishable keys are read-only. All mutations go through Server Actions
  that call `assertAdmin()` first.
- **Admin access is allowlist-controlled** (`app_admins`), not self-service.
- **Never expose the service-role key.** It bypasses RLS entirely, so it must
  only ever be set as `SUPABASE_SERVICE_ROLE_KEY` — never in a `NEXT_PUBLIC_*`
  variable, which Next.js inlines into the browser bundle.
- **No personal email addresses live in this repo.** The only two addresses in
  the source are the branch's own: the public contact mailbox in
  `lib/site-config.ts`, and the technical account seeded into the `app_admins`
  allowlist. Both are role accounts that survive a change of committee. An
  address in the allowlist grants dashboard access but is not a credential on
  its own — the account still needs a password, so protect that account with
  2FA.
  When taking over an existing database, audit who currently holds access and
  remove anything unexpected:

  ```sql
  SELECT email, note, created_at FROM public.app_admins ORDER BY created_at;
  DELETE FROM public.app_admins WHERE email = 'stale@example.com';
  ```
- `lib/rate-limit.ts` is per-instance and in-memory. It is a basic abuse brake,
  not a guarantee; on multi-instance hosting put a real limiter or CAPTCHA in
  front of the public forms.

⚠️ The previous codebase committed a Supabase URL + anon key to git history
(`src/lib/supabaseClient.js`). This rebuild uses a fresh project and server-only
secrets, but the **old project's keys should be rotated or the project paused**,
since they remain in history.

## Roadmap (phase 2)

Schema and code leave room for: event galleries & RSVPs (tables exist),
full-text search (GIN indexes), keyset pagination, resources/recordings,
real event registrations, a tag taxonomy, and opt-in caching (`use cache` +
tag-based revalidation) once traffic warrants it.
