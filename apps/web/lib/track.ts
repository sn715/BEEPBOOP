// Single place every tracked event goes through. It reports to Google Analytics
// (loaded in app/layout.tsx) and, once the Meta Pixel snippet is added, to Meta.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// Our event names are Meta's standard ones; these are the GA4 recommended equivalents.
const gaEventNames: Record<string, string> = {
  Lead: "generate_lead",
  ViewContent: "select_content",
};

export function track(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", gaEventNames[eventName] ?? eventName, data);
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, data);
  }
}
