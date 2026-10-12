import { NextResponse } from "next/server";

// Forwards waitlist signups to the Google Apps Script web app attached to the
// waitlist sheet (see google-apps-script/waitlist.gs). The script URL and the
// shared secret only live in server env vars.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCATIONS = new Set(["hero", "waitlist"]);

export async function POST(request: Request) {
  const scriptUrl = process.env.WAITLIST_SCRIPT_URL;
  const secret = process.env.WAITLIST_SECRET;
  if (!scriptUrl || !secret) {
    console.error("waitlist: WAITLIST_SCRIPT_URL or WAITLIST_SECRET is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: { email?: unknown; location?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const location = typeof body.location === "string" && LOCATIONS.has(body.location) ? body.location : "";

  try {
    // Apps Script answers POSTs with a redirect to the result; fetch follows it
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, email, location }),
      cache: "no-store",
    });
    const result = (await res.json()) as { ok?: boolean; error?: string };
    if (!result.ok) {
      console.error("waitlist: script rejected signup", result.error);
      return NextResponse.json({ ok: false, error: "save_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("waitlist: could not reach script", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 502 });
  }
}
