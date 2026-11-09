/**
 * Waitlist → Google Sheet
 *
 * Paste this into the sheet's Apps Script editor (Extensions → Apps Script),
 * set SECRET to the same value as WAITLIST_SECRET in Vercel, then
 * Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * After editing an existing deployment, use Deploy → Manage deployments → edit →
 * Version: New version, so the URL stays the same.
 * The site's /api/waitlist route posts here; the URL and secret stay server-side.
 */
const SECRET = "PASTE_WAITLIST_SECRET_HERE";
const HEADERS = [
  "timestamp",
  "email",
  "signed up from",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "referrer",
];
const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    if (data.secret !== SECRET) return json({ ok: false, error: "unauthorized" });

    const email = String(data.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return json({ ok: false, error: "invalid_email" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    // Write (or extend) the header row so new columns get labels on older sheets
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    if (headerRange.getValues()[0].join("") !== HEADERS.join("")) headerRange.setValues([HEADERS]);

    // Skip emails that are already on the list
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      if (existing.some((row) => String(row[0]).toLowerCase() === email)) {
        return json({ ok: true, duplicate: true });
      }
    }

    const row = [new Date(), text(email), text(data.location)].concat(ATTRIBUTION_KEYS.map((key) => text(data[key])));
    sheet.appendRow(row);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Visitor-supplied values are stored as plain text. Sheets would otherwise run
// anything starting with = + - @ as a formula.
function text(value) {
  const s = String(value || "").slice(0, 254);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
