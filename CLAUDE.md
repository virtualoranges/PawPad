# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PawPad is a pet management and smart tag web app. Pet owners register their pets, claim NFC/QR smart tags, and when a lost pet is scanned, the finder sees a public profile page. The app uses Supabase for auth + database and is deployed via Vercel.

## Commands

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Deploy (commits and pushes to trigger Vercel deploy)
npm run deploy
```

## Architecture

**Stack:** React 19, Vite, Tailwind CSS v4, Supabase, React Router v7, Framer Motion, Lucide icons.

**Supabase client** is initialized in `src/App.jsx` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars, then re-exported. All pages import `supabase` from `../App.jsx` (not from `supabaseClient.js`, which is a legacy unused file).

**Routing** (defined in `src/App.jsx`):
- `/` — main app shell / home
- `/login` — `LoginPage.jsx`
- `/dashboard` — `dashboard.jsx` — owner's pet profile + scan log
- `/claim/:id` — `claim.jsx` — first scan of a new tag; prompts user to claim it
- `/setup-pet` — `setup-pet.jsx` — post-claim pet profile setup
- `/p/:id` — `pages/p/[id].jsx` — public finder view shown when a stranger scans a tag
- `/settings` — `settings.jsx` — owner account/pet settings

**Supabase tables:**
- `pet_tags` — one row per tag; columns include `id`, `owner_id`, `pet_name`, and pet metadata
- `scan_logs` — log entry per QR/NFC scan; columns include `tag_id`, `scanned_at`

**Notifications:** Telegram Bot API is used for scan alerts (bot token stored in `dashboard.jsx`; should be moved to env vars).

## Environment Variables

Create a `.env` file at the project root:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Do not commit `.env`. The `supabaseClient.js` file in `src/` contains a hardcoded URL but is not actively used — prefer the env-var approach in `App.jsx`.

## Key Patterns

- Pages live in `src/pages/`. The public finder page uses Next.js-style filename `[id].jsx` but runs in Vite/React Router (the bracket filename is convention only).
- The `src/App.jsx` file is large and contains both routing logic and a large `BREEDS` data constant. New breed data or constants should stay in that file rather than splitting to avoid import churn.
- Tailwind v4 is configured via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`; configuration goes in CSS if needed.
