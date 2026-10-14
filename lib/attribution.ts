// Where a visitor came from, saved with their waitlist signup.
// UTM tags are read from the landing URL and remembered in localStorage, so a
// visitor who arrives from a tagged link and signs up on a later visit still
// gets credited to that link. A newer tagged visit replaces the older one.

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | "referrer", string>>;

const STORAGE_KEY = "bb_attribution";

function readStored(): Attribution {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

// Call once when the page loads.
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value.slice(0, 100);
  }

  // Only count referrers from other sites (not clicks within this one)
  let referrer = "";
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.host !== window.location.host) referrer = ref.host;
  } catch {}

  if (Object.keys(fromUrl).length > 0) {
    if (referrer) fromUrl.referrer = referrer;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {}
  } else if (referrer && !readStored().referrer) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), referrer }));
    } catch {}
  }
}

export function getAttribution(): Attribution {
  return readStored();
}
