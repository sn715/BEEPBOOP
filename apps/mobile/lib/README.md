# lib/

Non-UI code.

- `supabase.ts`: the Supabase client (reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `.env`)
- `api/`: data queries grouped by thing (`entries.ts`, `profiles.ts`, `media.ts`)
- small helpers (date formatting, image resizing before upload)

Only the Supabase **anon** key goes in the app. It's safe to ship because access is controlled by row-level security in the database (see `/supabase`). Never put the service-role key here.
