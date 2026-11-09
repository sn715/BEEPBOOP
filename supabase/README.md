# supabase/

The app's backend: database, accounts and photo storage, on Supabase.

**Status:** folder only. To start, install the Supabase CLI and run `supabase init` from the repo root. It adds `config.toml` here and uses the folders below.

| Folder | What goes there |
|---|---|
| `migrations/` | SQL files that create and change tables, in order (`supabase migration new <name>`) |
| `functions/` | Edge functions: server code that needs secrets (e.g. looking up a concert by artist and date) |

## Data model (first draft)

| Table | Key columns |
|---|---|
| `profiles` | `id` (= auth user), `username`, `display_name`, `avatar_url` |
| `concerts` | `id`, `artist`, `venue`, `city`, `date` |
| `entries` | `id`, `user_id`, `concert_id`, `rating` (1–5), `review`, `privacy` (`public` / `friends` / `private`, default `friends`), `created_at` |
| `entry_media` | `id`, `entry_id`, `storage_path`, `kind` (`photo` / `video`), `position` |
| `follows` | `follower_id`, `following_id` ("friends" = people who follow each other) |

**Storage:** one bucket, `entry-media`, with files under `<user_id>/<entry_id>/…`.

**Privacy is enforced in the database** with row-level security (RLS), not in the app:
- `public` entries can be read by anyone.
- `friends` entries can be read by mutual follows.
- `private` entries can be read only by their owner.

The same rules apply to an entry's photos.

## Not connected to the waitlist

The landing page's waitlist still saves to the Google Sheet (`apps/web/google-apps-script`). When the app launches, those emails can be imported here or invited by email.
