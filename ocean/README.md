# Ocean 🌊

Ocean is an all-in-one **calm productivity workspace + scheduling tool** — it combines a Calendly-style public booking system with a personal productivity suite (tasks, habits, goals, journal, notes, focus timer, and an encrypted vault), all in a single Next.js app.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication Flows](#authentication-flows)
- [Deployment](#deployment)

---

## Overview

Ocean has two halves that share one Postgres database and one auth session:

1. **Scheduling** — a Calendly-style booking tool. Users define availability and event types, share a public link (`/[username]/[eventUrl]`), and guests book time slots that sync to the host's calendar via [Nylas](https://www.nylas.com/).
2. **Productivity suite** — a personal dashboard for daily life: an Eisenhower-matrix task planner with time-blocking, habit tracking with streaks, weekly/monthly/yearly goals, a daily journal, quick notes, a focus/pomodoro timer, a water/mood/sleep daily log, and an AES-256-GCM encrypted vault for secrets.

The design intent (tone, layout, and UX principles) is documented in [`docs/DESIGN_SPEC.md`](docs/DESIGN_SPEC.md).

---

## Features

### 📅 Booking & Scheduling
- Public booking page per user/event (`app/(bookingPage)/[username]/[eventUrl]`)
- Configurable weekly availability (`Availability` model, per day of week)
- Multiple event types per user (duration, description, video call software)
- Guest booking flow with confirmation/cancellation status
- Calendar sync via Nylas (create/read events on the host's connected calendar)

### 🗂️ Productivity Dashboard
| Module | Description |
|---|---|
| **Planner / Tasks** | Eisenhower matrix (urgent/important quadrants) with drag-and-drop (`@dnd-kit`) and optional time-blocking on a day view |
| **Habits** | Daily habit tracking with per-day logs, streaks, and configurable target counts |
| **Goals** | Weekly / monthly / yearly goals with progress tracking |
| **Journal** | Daily / weekly / monthly reflections with mood and gratitude fields |
| **Notes** | Quick capture notes — pinnable, color-coded, archivable |
| **Focus** | Pomodoro / deep-work session timer with history |
| **Daily Log** | Water intake, mood, and sleep hours tracked per day |
| **Vault** | Encrypted storage for passwords, cards, keys, and secure notes (AES-256-GCM, encrypted at rest) |

All of the above are aggregated into a single "Today" dashboard view (`app/lib/queries.ts` → `getDashboardData`).

### 🔐 Auth
- Sign in with **Google** or **GitHub** via NextAuth v5 (Auth.js)
- Sessions and accounts persisted to Postgres via the Prisma adapter

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4 (CSS-first config), [shadcn/ui](https://ui.shadcn.com/) ("new-york" style) on top of Radix primitives |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma 6 (client generated to `app/generated/prisma`) |
| Auth | NextAuth v5 (beta) with `@auth/prisma-adapter`, Google & GitHub OAuth |
| Calendar sync | [Nylas](https://www.nylas.com/) API (separate OAuth grant flow) |
| File uploads | UploadThing |
| Forms & validation | `@conform-to/react` + `@conform-to/zod` + Zod schemas |
| Drag & drop | `@dnd-kit` (core, sortable, utilities) |
| Dates | `date-fns` |
| Icons | `lucide-react` |
| Toasts / UI feedback | `sonner` |
| Theming | `next-themes` (light/dark) |

---

## Project Structure

```
ocean/
├── app/
│   ├── (bookingPage)/[username]/[eventUrl]/   # Public booking page (guest-facing)
│   ├── api/
│   │   ├── auth/[...nextauth]/                # NextAuth route handler
│   │   ├── oauth/exchange/                    # Nylas OAuth token exchange
│   │   └── uploadthing/                       # File upload endpoint
│   ├── dashboard/
│   │   ├── availability/  events/  meetings/  new/  settings/   # Scheduling management
│   │   ├── focus/  goals/  habits/  journal/  notes/  planner/  vault/   # Productivity modules
│   │   └── layout.tsx, page.tsx                # Dashboard shell + "Today" view
│   ├── onboarding/grant-id/                   # Nylas calendar-grant onboarding step
│   ├── success/                                # Post-booking confirmation page
│   ├── generated/prisma/                       # Generated Prisma client (gitignored)
│   ├── lib/
│   │   ├── actions/                            # Server actions (daily, focus, goals, habits, journal, notes, tasks, vault)
│   │   ├── auth.ts                             # NextAuth config (providers, adapter)
│   │   ├── crypto.ts                           # AES-256-GCM helpers for the Vault
│   │   ├── dates.ts                            # UTC day/week/month normalization
│   │   ├── db.ts                               # Prisma client singleton
│   │   ├── nylas.ts                            # Nylas API client
│   │   ├── queries.ts                          # Aggregated dashboard data fetching
│   │   ├── times.ts                            # Time-slot helpers for booking
│   │   ├── uploadthings.ts                     # UploadThing route config
│   │   └── zodSchemas.ts                       # Shared Zod validation schemas
│   ├── action.ts                                # Top-level server actions
│   ├── globals.css                              # Tailwind v4 theme + design tokens
│   └── layout.tsx, page.tsx                     # Root layout & landing page
├── components/
│   ├── bookingForm/         # Calendar/time-slot picker for guest booking
│   ├── dashboard/           # Dashboard widgets (FocusTimer, HabitRow, WaterMood, Weather, ...)
│   ├── goals/ habits/ journal/ notes/ planner/ vault/   # Feature-specific managers/boards
│   ├── landing/             # Marketing/landing page sections
│   ├── ui/                  # shadcn/ui primitives (button, card, dialog, select, ...)
│   └── *.tsx                 # Shared components (Navbar, Hero, AuthModel, SettingsForm, ...)
├── lib/utils.ts              # shadcn `cn()` class-merge helper
├── prisma/
│   └── schema.prisma         # Database schema (see Data Model below)
├── docs/
│   └── DESIGN_SPEC.md        # UX/design specification for the product
├── public/                   # Static assets (logos, hero images, OAuth provider icons)
├── next.config.ts            # Image remote patterns (Google/GitHub avatars, UploadThing)
├── components.json           # shadcn/ui config
└── .env.example               # Template for required environment variables
```

---

## Data Model

Defined in [`prisma/schema.prisma`](prisma/schema.prisma), backed by PostgreSQL.

**Auth** (NextAuth/Prisma adapter standard): `User`, `Account`, `Session`, `VerificationToken`

**Scheduling**:
- `Availability` — per-user weekly availability windows (`Day` enum)
- `EventType` — bookable event definitions (duration, URL slug, description)
- `Booking` — guest bookings against an event type (`BookingStatus`: CONFIRMED/CANCELLED)

**Productivity**:
- `Task` — Eisenhower quadrant + optional time-blocking (`TaskStatus`, `TaskQuadrant`)
- `Habit` / `HabitLog` — habit definitions and per-day completion logs
- `Note` — quick capture notes
- `Goal` — periodic goals (`GoalPeriod`: WEEKLY/MONTHLY/YEARLY)
- `JournalEntry` — reflections (`JournalKind`: DAILY/WEEKLY/MONTHLY)
- `FocusSession` — logged pomodoro/deep-work sessions
- `DailyLog` — water/mood/sleep per day
- `VaultItem` — encrypted secrets (`VaultCategory`: PASSWORD/NOTE/CARD/KEY/OTHER)

All productivity models are scoped by `userId` with cascading deletes on user removal.

---

## Getting Started

### Prerequisites
- Node.js 18.18+ (Next.js 15 requirement)
- A PostgreSQL database (e.g. [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or local Postgres)
- OAuth apps registered with Google and GitHub
- A [Nylas](https://www.nylas.com/) account for calendar sync
- An [UploadThing](https://uploadthing.com/) account for file uploads

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in real values
cp .env.example .env

# 3. Push the schema / run migrations
npx prisma migrate dev

# 4. Generate the Prisma client (also runs automatically on install/migrate)
npx prisma generate

# 5. Start the dev server (Turbopack)
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

See [`.env.example`](.env.example) for the full template. Summary:

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | NextAuth session encryption secret |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth app credentials |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth client credentials |
| `DATABASE_URL` | Pooled Postgres connection string |
| `DIRECT_URL` | Direct (non-pooled) Postgres connection string, used by Prisma migrations |
| `NYLAS_API_SECRET_KEY` / `NYLAS_API_URI` / `NYLAS_API_CLIENT_ID` | Nylas calendar sync credentials |
| `NEXT_PUBLIC_URL` | Public base URL, used in OAuth callbacks and booking links |
| `UPLOADTHING_TOKEN` | UploadThing API token |
| `VAULT_SECRET` | Base64-encoded 32-byte key for AES-256-GCM Vault encryption (generate with `openssl rand -base64 32`) |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint (`next/core-web-vitals` + `next/typescript`) |

---

## Authentication Flows

Ocean has **two distinct OAuth flows** — don't confuse them:

1. **Login (NextAuth v5)** — `app/lib/auth.ts` configures Google/GitHub providers with the Prisma adapter. Users sign in via `components/AuthModel.tsx` / `components/SubmitButtons.tsx`, handled by `app/api/auth/[...nextauth]/`.
2. **Calendar grant (Nylas)** — a separate flow for connecting a user's calendar for scheduling, handled by `app/api/oauth/exchange/` and the onboarding step at `app/onboarding/grant-id/`. This grants Ocean permission to read/write calendar events on the user's behalf — independent of login.

---

## Deployment

Ocean is a standard Next.js app and deploys cleanly to [Vercel](https://vercel.com/) or any Node.js host that supports Next.js 15. Make sure to:

1. Set all environment variables from `.env.example` in your hosting provider.
2. Run `npx prisma migrate deploy` against your production database as part of the build/release step.
3. Configure OAuth app callback URLs (Google, GitHub, Nylas) to point at your production domain.
