# packages/shared

TypeScript code used by both the website and the app, so the two never disagree about what a concert entry looks like.

**Status:** folder only. When the first file goes in `src/`, add a `package.json` named `@bridge/shared` and add `"packages/shared"` to the root `workspaces` list.

## What goes in `src/`

- **Types** for the data model in `/supabase`:
  - `Profile`: username, display name, avatar
  - `Concert`: artist, venue, date (one real-world show)
  - `Entry`: one person's log of a concert: rating (1–5), review, privacy, times seen
  - `Media`: a photo or clip attached to an entry
  - `Privacy`: `"public" | "friends" | "private"` (friends only is the default)
- **Constants** shared by web and app (the privacy labels, rating limits)
- **Validation** for anything typed in both places (email, username rules)
