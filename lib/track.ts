// Single place every tracked event goes through. Once the Meta Pixel snippet is
// added to the layout, window.fbq exists and these calls start reporting.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(eventName: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, data);
  }
}
