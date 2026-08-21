# MUNSoC NIT Jalandhar — Official Web Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38bdf8?style=for-the-badge&logo=tailwindcss)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-Automation-34A853?style=for-the-badge&logo=googlesheets)

**Official web platform for the Model United Nations Society (MUNSoC), Dr. B. R. Ambedkar National Institute of Technology, Jalandhar.**

[Live Website](https://munsoc.opensourcenitj.com) • [Committees](https://munsoc.opensourcenitj.com/committees/ypm) • [Documentation](docs/GOOGLE_SHEETS_SETUP.md)

</div>

---

## 📖 Overview

The MUNSoC web platform empowers delegates and organizers with an end-to-end conference management system. Built with **Next.js 16 (App Router & Turbopack)**, **Tailwind CSS v4**, and **Google Apps Script**, it provides seamless delegate registration, real-time portfolio allocation tracking, automated email workflows, payment receipt verification, and marketing campaign analytics.

---

## ✨ Key Features

### 🏛️ Youth Parliament (YPM) Delegate Registration
- **Interactive Portfolio Picker**: Multi-tier preference selection with real-time portfolio availability indicators.
- **Payment Verification**: Integrated UPI QR payments, transaction ID validation, and automated receipt image hosting via ImgBB.
- **Dynamic Capacity Management**: Automatically closes registration when portfolio limits are met.

### 📊 Real-Time Google Sheets Backend
- **Live Two-Way Synchronization**: Form submissions append directly to Google Sheets with script concurrency locking.
- **Custom Spreadsheet UI Menu (`🏛️ MUNSoC Platform`)**:
  - `🚀 Initialize / Format Sheets & Dropdowns` — One-click setup for headers, conditional color pills, and validations.
  - `🔧 Fill Missing Status & Email Sent Defaults` — Auto-populates `Pending` and `No` across rows.
  - `📧 Send Allotment Confirmation Emails` — Dispatches branded portfolio allotment emails to confirmed delegates.
  - `📊 Check Allotment Count & Status` — Live conference capacity overview modal.
- **Dropdown & Color Badges**: Preconfigured status indicators (`Pending` 🟡, `Allotted` 🔵, `Confirmed` 🟢, `Waitlisted` 🟠, `Rejected` 🔴, `Cancelled` ⚪).

### 📧 Automated Email Notification Pipeline (Google Apps Script)
- **High-Deliverability via `GmailApp`**: Dispatched directly with SPF/DKIM authentication and multipart HTML/plain-text fallbacks to prevent spam flagging.
- **Delegate Acknowledgment Receipts**: Sent automatically upon form submission.
- **Secretariat Alerts**: Instant notifications sent to `nitjmunsoc@gmail.com` with complete registration metadata.
- **Portfolio Allotment Confirmations**: One-click dispatch with customized portfolio details, opening speech guidelines, and committee information.
- **Security & Rate-Limit Alerts**: Automated diagnostic alerts sent if suspicious submission bursts occur.

### 🔗 Campaign Referral Tracking (`?ref=...`)
- **Built-in Link Tracking**: Captures marketing campaign clicks (e.g. `/?ref=instagram_promo`) and logs timestamps, IP, city, region, country, and user-agent into a dedicated `Referrals` Google Sheet.

### 🛡️ Security & Rate Limiting
- **Rolling Rate Limiter**: Limits submissions to 3 per hour per IP address to prevent bot abuse.
- **Webhook Authentication**: Protected with a shared HMAC secret (`WEBHOOK_SECRET`) between Next.js and Google Apps Script.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [tw-animate-css](https://github.com/)
- **Animations**: [Motion](https://motion.dev/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Base UI](https://base-ui.com/), [Lucide React](https://lucide.dev/)
- **Backend Automation**: [Google Apps Script](https://developers.google.com/apps-script)
- **Media Hosting**: [ImgBB API](https://api.imgbb.com/)
- **SEO & Sitemaps**: [next-sitemap](https://github.com/iamvishnusankar/next-sitemap)

---

## 📁 Project Structure

```text
munsoc/
├── app/
│   ├── api/
│   │   ├── register/route.ts      # Registration & portfolio sync API
│   │   ├── track/route.ts         # Referral click tracking API
│   │   ├── upload/route.ts        # Payment receipt image upload handler
│   │   └── shared.ts              # In-memory session stores
│   ├── committees/
│   │   ├── page.tsx               # Redirects to active committee
│   │   └── ypm/page.tsx           # Youth Parliament (YPM) committee page
│   ├── globals.css                # Tailwind CSS styling & theme definitions
│   ├── layout.tsx                 # Root application layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── committees/
│   │   ├── committees-grid.tsx    # Committee showcase grid
│   │   └── ypm-client.tsx         # YPM interactive registration client
│   ├── home/                      # Landing page sections (Hero, About, CTA, etc.)
│   ├── motion/                    # Framer/Motion transition components
│   └── navbar.tsx                 # Responsive navigation bar
├── docs/
│   └── GOOGLE_SHEETS_SETUP.md     # Step-by-step Google Sheets & Apps Script deployment guide
├── proxy.ts                       # Next.js edge/middleware tracking proxy
├── public/                        # Static assets, logos, and sitemaps
├── scripts/
│   └── google-sheets-handler.js   # Complete Google Apps Script webhook & email engine
├── .env.example                   # Environment template
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later
- **npm** or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/Opensource-NITJ/munsoc.git
cd munsoc
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:
```env
# Google Sheets Webhook Deployment URL
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
REF_TRACKING_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"

# Shared Webhook Authentication Secret (must match Apps Script)
WEBHOOK_SECRET="your_secure_random_secret_hex"

# Portfolio Capacity Limit (Defaults to 65 for YPM)
PORTFOLIO_LIMIT="65"

# ImgBB API Key (Optional - for hosting payment receipt uploads)
IMGBB_API_KEY="your_imgbb_api_key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📊 Google Sheets & Automation Setup

Detailed instructions on how to set up the Google Spreadsheet, paste the Apps Script code, and deploy the Web App endpoint are documented in:
👉 **[Google Sheets & Automation Setup Guide](docs/GOOGLE_SHEETS_SETUP.md)**

---

## 📜 License

This project is maintained by **Opensource-NITJ** and the **Model United Nations Society (MUNSoC)**, NIT Jalandhar.
