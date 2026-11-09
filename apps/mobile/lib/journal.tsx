import { createContext, ReactNode, useContext, useMemo, useState } from "react";

// Demo data lives in memory: anything added is gone when the app restarts.

export type Privacy = "public" | "private";
export type Clip = { photo: number; start: number; end: number };
export type Media = { kind: "clip"; photo: number } | { kind: "image"; source: number };

export type Entry = {
  id: string;
  artist: string;
  venue: string;
  date: string; // YYYY-MM-DD
  review: string;
  number: number;
  privacy: Privacy;
  media: Media[];
  thumbnail?: { source: number; heightPercent?: number; topPercent?: number };
};

export type Draft = {
  clips: Clip[];
  artist: string;
  venue: string;
  date: Date | null;
  review: string;
  privacy: Privacy;
};

export type Profile = {
  phone: string;
  name: string;
  handle: string;
  photoUri: string | null;
  artists: string[];
};

const SAMPLE_REVIEW =
"I went to see Ryan Beatty at the Greek Theatre last week and it was AMAZING!!! The venue was beautiful and the whole crowd was singing along :))) ABSOLUTE MUST SEE!!!!";
function sample(
  id: string,
  artist: string,
  venue: string,
  date: string,
  source: number,
  crop: { heightPercent?: number; topPercent?: number } = {},
  extraMedia: number[] = [],
): Entry {
  return {
    id,
    artist,
    venue,
    date,
    review: SAMPLE_REVIEW,
    number: 0,
    privacy: "private",
    media: [source, ...extraMedia].map((image) => ({ kind: "image", source: image })),
    thumbnail: { source, ...crop },
  };
}

const SAMPLE_ENTRIES: Entry[] = [
  sample("ryan-beatty", "Ryan Beatty", "Greek Theatre", "2026-09-28", require("../assets/images/thumb-ryan.png"), {}, [
    require("../assets/images/hero-ryan-2.png"),
  ]),
  sample("kali-uchis", "Kali Uchis", "Intuit Dome", "2026-09-01", require("../assets/images/thumb-kali.png"), {
    heightPercent: 163.04,
    topPercent: -5.19,
  }),
  sample("playboi-carti", "Playboi Carti", "Crypto.com Arena", "2026-08-14", require("../assets/images/thumb-carti.png")),
  sample("sabrina-carpenter", "Sabrina Carpenter", "Crypto.com Arena", "2026-07-28", require("../assets/images/thumb-sabrina.png"), {
    heightPercent: 163.04,
    topPercent: -5.19,
  }),
  sample("djo", "Djo", "Greek Theatre", "2026-07-20", require("../assets/images/thumb-djo.png")),
  sample("lorde", "Lorde", "Kia Forum", "2026-07-01", require("../assets/images/thumb-lorde.png")),
  sample("tate-mcrae", "Tate McRae", "Kia Forum", "2026-06-19", require("../assets/images/thumb-tate.png"), {
    heightPercent: 162.23,
    topPercent: -15.39,
  }),
].map((entry, index, all) => ({ ...entry, number: all.length - index })); // The oldest show is entry #1.

const SAMPLE_PROFILE: Profile = {
  phone: "",
  name: "Edith Chang",
  handle: "edithhchang",
  photoUri: null,
  artists: [],
};

const EMPTY_PROFILE: Profile = { phone: "", name: "", handle: "", photoUri: null, artists: [] };
const EMPTY_DRAFT: Draft = { clips: [], artist: "", venue: "", date: null, review: "", privacy: "private" };

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const parseDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateString = (date: Date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");

// "Tuesday, Sept 1, 2026"
export const formatFullDate = (date: Date) =>
  `${WEEKDAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

// "Sept 1"
export const formatEntryDay = (entry: Entry) => {
  const date = parseDate(entry.date);
  return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
};

export const formatEntryDate = (entry: Entry) => formatFullDate(parseDate(entry.date));

// "september 2026"
export const formatMonthHeading = (entry: Entry) => {
  const date = parseDate(entry.date);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

type JournalContextValue = {
  entries: Entry[];
  draft: Draft;
  profile: Profile;
  nextEntryNumber: number;
  // False until someone taps a welcome button. A page reload resets it, which sends the demo back to welcome.
  started: boolean;
  updateProfile: (changes: Partial<Profile>) => void;
  startNewAccount: () => void;
  loadSampleAccount: () => void;
  startDraft: () => void;
  updateDraft: (changes: Partial<Draft>) => void;
  saveDraft: () => string;
  updateEntry: (id: string, changes: Partial<Entry>) => void;
};

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [started, setStarted] = useState(false);

  const nextEntryNumber = entries.length + 1;

  const value = useMemo<JournalContextValue>(
    () => ({
      // Newest first. New entries go in front, so they sit above older entries from the same day.
      entries: [...entries].sort((a, b) => b.date.localeCompare(a.date)),
      draft,
      profile,
      nextEntryNumber,
      started,
      updateProfile: (changes) => setProfile((current) => ({ ...current, ...changes })),
      startNewAccount: () => {
        setStarted(true);
        setEntries([]);
        setProfile(EMPTY_PROFILE);
      },
      loadSampleAccount: () => {
        setStarted(true);
        setEntries(SAMPLE_ENTRIES);
        setProfile(SAMPLE_PROFILE);
      },
      startDraft: () => setDraft(EMPTY_DRAFT),
      updateDraft: (changes) => setDraft((current) => ({ ...current, ...changes })),
      saveDraft: () => {
        const id = `entry-${nextEntryNumber}`;
        const entry: Entry = {
          id,
          artist: draft.artist.trim(),
          venue: draft.venue.trim(),
          date: toDateString(draft.date ?? new Date()),
          review: draft.review.trim(),
          number: nextEntryNumber,
          privacy: draft.privacy,
          media: draft.clips.map(({ photo }) => ({ kind: "clip", photo })),
        };
        setEntries((current) => [entry, ...current]);
        setDraft(EMPTY_DRAFT);
        return id;
      },
      updateEntry: (id, changes) =>
        setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry))),
    }),
    [entries, draft, profile, nextEntryNumber, started],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const value = useContext(JournalContext);
  if (!value) throw new Error("useJournal must be used inside JournalProvider");
  return value;
}
