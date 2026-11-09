# bridge

A personal archive of the concerts you've been to: log a show, rate and review it, keep the photos and clips from the night, and choose who sees each entry.

This repo holds everything for bridge, organized as an npm workspaces monorepo.

```
.
├── apps/
│   ├── web/          the landing page + waitlist (Next.js), live on Vercel
│   └── mobile/       the bridge iPhone app (Expo / React Native), early demo with its own install
├── packages/
│   ├── shared/       TypeScript types and constants used by web and mobile
│   └── design/       colors, fonts and logo rules
├── supabase/         the app's backend: database migrations and edge functions
└── package.json      workspace root
```

Each folder has its own README with details.

## Commands

Run from the repo root:

```bash
npm install       # installs every workspace
npm run dev       # landing page at http://localhost:3000
npm run build     # production build of the landing page
```

To run a command in one workspace: `npm run <script> -w apps/web`.

## Deploying the landing page

Vercel builds `apps/web`. In the Vercel project, **Settings → Build and Deployment → Root Directory** must be `apps/web`. Pushing to `main` deploys to production; other branches get preview URLs.

Local secrets for the waitlist live in `apps/web/.env.local` (not committed).
