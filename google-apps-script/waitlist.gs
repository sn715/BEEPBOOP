/**
 * Waitlist → Google Sheet
 *
 * Paste this into the sheet's Apps Script editor (Extensions → Apps Script),
 * set SECRET to the same value as WAITLIST_SECRET in Vercel, then
 * Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * The site's /api/waitlist route posts here; the URL and secret stay server-side.
 */
const SECRET = "PASTE_WAITLIST_SECRET_HERE";
const HEADERS = ["timestamp", "email", "signed up from"];

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
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    // Skip emails that are already on the list
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      if (existing.some((row) => String(row[0]).toLowerCase() === email)) {
        return json({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([new Date(), email, String(data.location || "").slice(0, 50)]);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
