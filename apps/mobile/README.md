# bridge (mobile app)

The bridge iPhone app: a personal archive of the concerts you've been to. Log a show, rate and review it, keep the photos and clips from the night, and choose who sees each entry.

**Status:** folder structure only. Nothing is installed yet.

## Stack (planned)

- **Expo + React Native**, TypeScript
- **Expo Router** for navigation (each file in `app/` is a screen)
- **Supabase** for accounts, data and photo storage (see `/supabase`)
- Shared types from `packages/shared`, colors and fonts from `packages/design`

## Folders

| Folder | What goes there |
|---|---|
| `app/` | Screens and navigation (Expo Router, file-based) |
| `components/` | Reusable UI pieces used across screens |
| `hooks/` | React hooks for data and app state |
| `lib/` | Supabase client, data queries, helpers |
| `assets/fonts/` | Alte Haas Grotesk and Space Mono font files |
| `assets/images/` | App icon, splash screen, illustrations |

## Getting started (when ready to build)

From the repo root:

```bash
npx create-expo-app@latest apps/mobile --template tabs
```

Then add `"apps/mobile"` to the `workspaces` list in the root `package.json` and run `npm install` from the root. Keep the folders and READMEs here, and move the generated files into them.
