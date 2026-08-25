# Ontario Research Hub

Ontario Research Hub is a **Manus-hosted** source directory and research workspace for lawful Ontario public records, legal information, archives, and municipal open data. The GitHub repository remains the version-controlled source of truth and runs automated validation on every push.

> The Hub is designed for source discovery and responsible research. It does not scrape public websites, create person profiles, or provide identity, device, account, payment-card, SIM-swap, or licence-plate lookup services.

## What is included

| Area | Implementation |
| --- | --- |
| Public-source directory | Curated direct links to Ontario business, land, court, archive, legal, regulatory, provincial-data, and municipal-data sources. |
| Guided workflows | User-controlled exact-name and public-profile search shortcuts plus a local email-format check. |
| Evidence tools | A user-controlled domain-source launcher plus local-only SHA-256 and file-header evidence; no active scanning, uploads, or execution. |
| Privacy-first guidance | Corporate research starts with the entity; land research starts with the parcel. The site includes purpose, minimization, access-control, retention, and verification controls. |
| Citation log | Optional source-level citations stored in the visitor’s browser by default, exportable as CSV or Markdown, with an explicit-consent account sync option. |
| Research guide | A signed-in, server-side assistant for source selection, citation practice, privacy controls, and lawful workflow guidance. Conversation history remains in page memory and is not saved by the website. |
| Accounts | Manus OAuth sign-up/sign-in for the optional research guide. The source directory and local citation log remain usable without an account. |
| Payments | A configurable PayPal **hosted payment link**; payment entry occurs on PayPal, not in the app. |

## Hosting and accounts

The live application is hosted on Manus because OAuth sessions and server-side AI chat need a secure runtime. The app uses the platform-provided account flow; do not add credentials or OAuth keys to the repository. Visitors can create an account or sign in from the field-guide sidebar or mobile menu.

## Citation-log sync and consent

The citation log remains **browser-local by default**. A signed-in researcher may explicitly opt in to account sync by confirming that the current local citation title, URL, access date, purpose, notes, and saved date will be copied to their account. Sync is manual: local changes are never uploaded automatically. A researcher can restore the account copy to a browser, refresh its status, or use **Disconnect and delete account copy** to permanently remove all synced citations without affecting the local browser log.

The research guide is intentionally safety-bounded. It is not a person lookup, device or phone intelligence tool, network scanner, or private-data service. Do not enter personal identifiers, credentials, payment data, confidential records, or other sensitive information into the guide.

## Configure PayPal

Create an approved PayPal hosted button or donation/payment link, then update `paypalCheckoutUrl` in [`client/src/lib/site-config.ts`](client/src/lib/site-config.ts). Before enabling checkout, publish your service description, price or contribution terms, privacy notice, refund policy, and support contact details. The current button remains inactive until its placeholder URL is replaced.

## Development and validation

Install dependencies with `pnpm install`, run the application with `pnpm dev`, and use `pnpm check`, `pnpm test`, and `pnpm build` before release. The [GitHub workflow](.github/workflows/deploy.yml) performs the same validation on changes to `main`; it does not deploy a static GitHub Pages version because the live app requires server-side OAuth and the research guide.

## Responsible-use note

Public accessibility is not a blanket authorization to copy, aggregate, or republish personal information. Use the Hub only for lawful, legitimate research, respect source-specific restrictions and publication bans, collect the smallest relevant record, and retain source context and access dates. For a transaction, dispute, regulated decision, or uncertainty about permitted use, seek qualified Ontario legal or privacy advice.

## Core sources

The directory uses direct links to the [Ontario Business Registry](https://www.ontario.ca/page/ontario-business-registry), [OnLand](https://www.onland.ca/ui/), [Ontario Courts case-search guidance](https://www.ontario.ca/page/search-court-cases-online), [Ontario Data Catalogue](https://data.ontario.ca/), and municipal open-data portals.
