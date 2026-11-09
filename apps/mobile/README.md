# bridge (mobile app)

The bridge iPhone app: a personal archive of the concerts you've been to. Log a show, rate and review it, keep the photos and clips from the night, and choose who sees each entry.

**Status:** clickable demo, using the GX-CREATIVE Figma file as a visual reference. There's no backend, and anything you add is gone when the app restarts.

- **New user:** welcome → phone → code → name → handle → photo → artists → friends → you're in → empty diary.
- **Returning user:** "i already have an account" on the welcome screen skips straight to a sample diary with 7 concerts.
- **Logging a show:** diary → new concert → pick and trim clips → write the entry → journal view → diary.

Colors, fonts and margins live in `lib/theme.ts`, and shared pieces (nav bar, buttons, fields) in `components/ui.tsx`.

## Running the demo

This needs Node 22 (`nvm use` picks it up from `.nvmrc`). Run these from this folder, not the repo root, because the app isn't in the root workspaces yet. That keeps its dependencies out of the landing page's lockfile and Vercel builds.

```bash
nvm use
npm install
npm run ios      # iOS simulator, through Expo Go
npm start        # then scan the QR code with Expo Go on an iPhone
```

## Web link

The demo also runs in a browser at **https://bridge-demo-psi.vercel.app**, for slides and sharing. On a laptop it sits in a phone-sized frame; on a phone it fills the screen. Reloading the page starts the demo over at the welcome screen, because nothing is saved.

To publish your latest changes to that link (needs the Vercel CLI login with access to the `bridge-demo` project):

```bash
npm run deploy:web
```

The web version uses the browser's date picker instead of the iPhone wheel.

## Stack

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
| `assets/fonts/` | Alte Haas Grotesk font files |
| `assets/images/` | App icon, splash screen, illustrations |

## Demo limitations

- `assets/images/camera-roll.png` is one flat screenshot. Tap targets and crops use its pixel positions (`lib/camera-roll.ts`), and the hearts and durations are part of the image. Replace it with real photos using `expo-media-library` when the app needs them.
- Clips are stills, so the trim screen's play button only moves the playhead. The trim handles do set the length saved with the clip.
- Sign-in is simulated: no text is sent, and any 10-digit number and 6-digit code work. "i already have an account" doesn't ask for anything.
- Friends and invites are sample people. Nothing reads your contacts or sends anything, and "terms and privacy policy" isn't a link yet.
- Entries, the profile and the draft live in memory (`lib/journal.tsx`). Supabase will replace this.
