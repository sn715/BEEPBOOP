# app/: screens

Expo Router turns this folder into the app's navigation: each file is a screen, and its path is its route. Folders in `(parentheses)` group screens without adding to the route.

| Path | Screen |
|---|---|
| `_layout.tsx` | Root layout: loads fonts. Later it will check sign-in and send signed-out users to `(auth)`; for now `index.tsx` always opens the welcome screen |
| `(auth)/` | **Onboarding** (built): welcome, phone, verify, name, handle, photo, artists, friends, done |
| `(tabs)/_layout.tsx` | Bottom tab bar |
| `(tabs)/diary/` | **Diary** (built): every show you've logged, grouped by month, with a "new concert" button |
| `(tabs)/explore/` | **Explore**: friends going, view from my seat, tour lore |
| `(tabs)/profile/` | **Profile**: your stats, times seen, year recap, settings |
| `entry/[id].tsx` | **Journal entry** (built): photos, artist, venue, date, review, privacy (public / private) |
| `entry/media-select.tsx` | **Media select** (built): first step of a new concert, picking clips from the camera roll |
| `entry/trim.tsx` | **Trim** (built): drag the handles to set a clip's length, then save, cancel or remove it |
| `entry/new.tsx` | **New concert** (built): artist, venue, date and the written entry |

The landing page's app mockups (`apps/web/public/images/phone-diary.png` and `phone-journal.png`) show the earlier black design, and may need updating to match.
