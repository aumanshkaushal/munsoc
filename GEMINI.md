# MUNSoC NIT Jalandhar — Project Rules & Context

## Project Overview
Next.js website for MUNSoC (Model United Nations Society) NIT Jalandhar.
Google Apps Script (`scripts/google-sheets-handler.js`) handles registrations via a deployed Web App webhook.

---

## Key Infrastructure

### Google Apps Script Webhook
- **Webhook URL:** Configured via `GOOGLE_SHEET_WEBHOOK_URL` in `.env.local`
- **Spreadsheet ID:** Stored server-side in Google Apps Script Script Properties
- **Secretariat email:** `nitjmunsoc@gmail.com`

### Apps Script Properties (secrets stored server-side, not in code)
Both of these must be set in Apps Script → ⚙️ Project Settings → Script Properties:
- `WEBHOOK_SECRET` — shared secret between Next.js and Apps Script
- `SPREADSHEET_ID` — Google Sheet spreadsheet ID (from the spreadsheet URL)

### .env.local Variables
- `GOOGLE_SHEET_WEBHOOK_URL` — the Apps Script deployed Web App `/exec` URL
- `REF_TRACKING_WEBHOOK_URL` — referral tracking Web App `/exec` URL
- `WEBHOOK_SECRET` — shared secret matching Apps Script property

---

## Conference Details
- **Event:** Youth Parliament Model (YPM)
- **Date:** 10 October 2026 (Tentative)
- **Default portfolio limit:** 65

---

## Important Decisions & Fixes

### SPREADSHEET_ID (Fixed Sept 2026)
`SPREADSHEET_ID` in `scripts/google-sheets-handler.js` is now read from Script Properties:
```js
const SPREADSHEET_ID =
  PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "";
```
Do NOT hardcode it. This fixed the `ss.getSheetByName is not a function` error (COUNT 25).

### Date Format Convention
All conference date references across the UI use: **`10 October 2026 (Tentative)`**
Files that contain the date:
- `app/page.tsx`
- `app/committees/ypm/page.tsx`
- `components/home/hero-section.tsx`
- `components/home/committees-section.tsx`
- `components/committees/committees-grid.tsx`
- `components/committees/ypm-client.tsx`

---

## Sheet Structure (Registrations sheet — 15 columns)
| Col | Header |
|-----|--------|
| A | Timestamp |
| B | Full Name |
| C | Email |
| D | WhatsApp Number |
| E | Institute / Organization |
| F | Preference 1 |
| G | Preference 2 |
| H | Preference 3 |
| I | MUN Experience |
| J | Transaction ID / Receipt URL |
| K | Committee |
| L | Allotted Portfolio |
| M | Status (Pending/Allotted/Confirmed/Waitlisted/Rejected/Cancelled) |
| N | Email Sent (No/Yes) |
| O | Email Sent At |
