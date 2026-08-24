# Ontario Research Hub

Ontario Research Hub is a static, GitHub Pages-ready source directory for lawful Ontario public-records, legal-information, archive, and open-data research. It provides guided outbound workflows for exact-name and public-profile searches, a local email-format check, and a configurable PayPal hosted-checkout handoff.

> The site does **not** store submitted identifiers, scrape websites, verify identities, or create person profiles. It opens user-controlled searches with external providers and directs visitors to the original source pages.

## What is included

| Area | Implementation |
| --- | --- |
| Ontario resources | Curated direct links to the Ontario Business Registry, Ontario Courts search guidance, Ontario Data Catalogue, Archives of Ontario, CanLII Ontario, and Toronto Open Data. |
| First and last name workflow | Builds an external exact-name search after a responsible-use acknowledgement. |
| Public-profile workflow | Builds an external domain-constrained search for a user-selected public platform. |
| Email check | Performs a syntax-only validation locally in the visitor’s browser. |
| Payments | Uses a PayPal **hosted payment link**, so checkout occurs on PayPal instead of on the GitHub Pages site. |

## Configure PayPal

This static site deliberately does not include a PayPal secret, server, or client-token checkout flow. Current PayPal JavaScript SDK v6 integrations use a server-generated client token, which is not appropriate for a static GitHub Pages-only build. The included hosted-checkout route avoids exposing payment credentials in the repository.

Create an approved PayPal hosted button or donation/payment link, then update the `paypalCheckoutUrl` value in [`client/src/lib/site-config.ts`](client/src/lib/site-config.ts). Before making the link live, publish your final service description, price or contribution terms, privacy notice, refund policy, and support contact details. The existing button deliberately remains inactive until the placeholder URL is replaced.

## Publish on GitHub Pages

The deployment workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys the site when `main` changes. In the GitHub repository, open **Settings → Pages**, set the deployment source to **GitHub Actions**, and allow the workflow to finish. The site will then be served from the repository Pages URL.

For local development, install dependencies with `pnpm install`, run `pnpm dev`, and open the development URL shown by Vite. Run `pnpm check` for TypeScript validation and `pnpm build` to generate the production website.

## Responsible-use note

Public accessibility is not a blanket authorization to copy, aggregate, or republish personal information. Use this project only for lawful, legitimate research, respect source-specific restrictions and publication bans, and keep a record of the original source and access date.

## Sources

The resource directory is based on the following public source pages: [Ontario Courts case-search guidance](https://www.ontario.ca/page/search-court-cases-online), [Ontario Business Registry](https://www.ontario.ca/page/ontario-business-registry), [Ontario Data Catalogue](https://data.ontario.ca/), and the [PayPal JavaScript SDK setup documentation](https://developer.paypal.com/sdk/js/set-up).
