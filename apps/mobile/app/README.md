# app/: screens

Expo Router turns this folder into the app's navigation: each file is a screen, and its path is its route. Folders in `(parentheses)` group screens without adding to the route.

| Path | Screen |
|---|---|
| `_layout.tsx` | Root layout: loads fonts, checks sign-in, sends signed-out users to `(auth)` |
| `(auth)/` | Sign in, sign up, choose a username |
| `(tabs)/_layout.tsx` | Bottom tab bar |
| `(tabs)/diary/` | **Diary**: every show you've logged, grouped by month, with a "new concert" button |
| `(tabs)/explore/` | **Explore**: friends going, view from my seat, tour lore |
| `(tabs)/profile/` | **Profile**: your stats, times seen, year recap, settings |
| `entry/[id].tsx` | **Journal entry**: photos, rating, review, privacy (public / friends / private) |
| `entry/new.tsx` | **New concert**: search artist and date, add photos, rate, review |

The diary and journal entry screens match the app mockups on the landing page (`apps/web/public/images/phone-diary.png` and `phone-journal.png`).
