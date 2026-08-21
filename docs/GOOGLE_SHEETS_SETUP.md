# Google Sheets Webhook & Email Integration Guide

This guide explains how the MUNSoC Web Platform integrates with Google Sheets and Google Apps Script for delegate registrations, real-time portfolio allotment sync, link referral tracking, and automated email dispatching via built-in Google Apps Script `MailApp`.

---

## 1. Setup Google Sheet & Apps Script

1. Open or create your Google Spreadsheet (e.g. `MUNSoC YPM 2026 Registrations`).
2. Click **Extensions** > **Apps Script** in the top navigation bar (or open [script.google.com](https://script.google.com)).
3. Open [`scripts/google-sheets-handler.js`](../scripts/google-sheets-handler.js) from this repository, copy its entire contents, and paste it into the Apps Script editor.
4. If running as a standalone script outside the sheet, set `const SPREADSHEET_ID = "..."` at line 30 with your sheet URL or ID.
5. Click the **Save** icon (diskette).
6. Select **`setupSheets`** from the function dropdown in the toolbar and click **Run**. Grant authorization when prompted. This creates:
   - `Registrations` sheet (15 columns, frozen top row, blue headers, status dropdown validation)
   - `Referrals` sheet (for tracking `?ref=...` campaign clicks)

---

## 2. Deploy Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon (Select type) > **Web app**.
3. Fill in the deployment details:
   - **Description**: `MUNSoC Registration, Tracking & Email Webhook`
   - **Execute as**: `Me (your Google account)`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

## 3. Configure Environment Variables

Add the Web App URL to your `.env.local` file:

```env
# Google Sheets Webhook Configuration
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
REF_TRACKING_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"

# Portfolio Capacity Limit (Defaults to 65 for YPM)
PORTFOLIO_LIMIT="65"

# ImgBB Upload (Optional for payment receipts)
IMGBB_API_KEY=""
```

---

## 4. Automated Email Features (Powered by Apps Script)

All emails are dispatched directly by Google Apps Script without requiring any external email services:

1. **Secretariat Notification Email**:
   - Dispatched immediately to `NOTIFICATION_EMAILS` (default: `nitjmunsoc@gmail.com`) with all registration fields, preferences, and payment transaction details whenever a delegate submits an application.

2. **Delegate Acknowledgment Email**:
   - Dispatched automatically to the delegate's email upon submission confirming that their registration and payment details have been received and are under review.

3. **Portfolio Allotment Confirmation Email**:
   - Dispatched to delegates when the Secretariat fills in _Allotted Portfolio_ (Column L), sets _Status_ (Column M) to `Allotted` or `Confirmed`, and triggers **🏛️ MUNSoC Platform > 📧 Send Allotment Confirmation Emails** from the Google Sheet toolbar.

4. **Security & Rate Limit Alert Email**:
   - Sent to the Secretariat if suspicious rapid submission patterns or rate-limit violations occur.
