# Home-Page Table of Contents Verification

## Scope

The home page was checked after adding the route-linked platform index. The index mirrors all fourteen primary menu destinations and groups them into Start & discover, Evidence & responsible practice, Ontario sources & data, and Workspace & support.

## Desktop review

At `1440×1000`, the index sits directly after the home-page hero. Each entry presents its route number, access model, short purpose statement, and direct in-app action. The grouped ledger layout is readable without competing with the left navigation rail.

## Mobile review

At `390×844`, the entry cards collapse to one column while preserving route numbers, access labels, short explanations, and the opening action. The home page remains a readable guided index rather than a long, unstructured list.

## Functional check

The table-of-contents unit test verifies that every menu destination has one metadata record and that each record belongs to a declared purpose group.

## Reduced button-box sitemap and print overview

The index was updated to a retained-offering sitemap after removing the Source Status, Research Sandbox, and Responsible Use pages. It now contains eleven button-style route boxes, each with an index number, access label, purpose description, and direct in-app action. At `1440×1000` the boxes retain their grouped two-column ledger layout; at `390×844` they stack into a single clear route list.

The **Print / Save PDF overview** control appears above the sitemap. It invokes the browser print dialog and uses print-only rules to render the public sitemap with an Ontario Research Hub masthead while suppressing the application rail, chat bubble, footer, and all account, citation, collection, and conversation content.

## Direct print and route validation

The home route was rendered through Chromium’s browser print pipeline. The generated two-page PDF contained the Ontario Research Hub print masthead and the eleven retained sitemap entries. A text extraction check found no application-rail, account, citation-entry, collection, copilot, or retired-route markers.

Representative sitemap actions were directly activated in a Chromium session. At desktop size, **Open Workbench**, **Open Ontario data**, and **Open Privacy & security** navigated to `/workbench`, `/ontario-data`, and `/privacy-resources`. At phone width, **Open Workbench** and **Open Citation log** navigated to their matching routes. A `390×844` Chromium session also found and directly invoked the **Print / Save PDF overview** control; the resulting two-page, 282,929-byte PDF contained the public sitemap only. Text extraction found zero account, citation, collection, sidebar, chat, or retired-route markers. The three retired URLs, `/research-sandbox`, `/source-status`, and `/responsible-use`, each displayed the application’s visible 404 fallback. The normal home page was also reviewed at `390×844`, where the sitemap button boxes stack into a single accessible list and the Print / Save PDF action remains available.
