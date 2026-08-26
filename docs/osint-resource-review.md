# OSINT Resources Directory Review

## Curation boundary

The supplied Start.me directory is an untrusted third-party index. It contains a mixture of public-reference, software-development, historical-record, and image-analysis links alongside phone intelligence, base-station and device geolocation, tracking links/files, IMEI checks, password-recovery pages, reverse shells, account takeover, telecom exploitation, scanners, dark-web resources, and offensive-security material.

The Ontario Research Hub will **not** reproduce or link to content that enables person targeting, phone/device lookup, geolocation, credential/account recovery, IP/log tracking, malware or exploit activity, scanning, evasion, fraud, financial validation, dark-web access, or unauthorized access.

## Initial candidate categories

| Candidate category | Treatment | Examples observed in the directory |
|---|---|---|
| Ontario/public data and regulatory references | Review individually and retain only official or clearly documented public sources. | LCBO API reference; LECA status page. |
| Historical/public-record methods | Review individually; retain only contextual, lawful research guidance. | Stephen P. Morse One-Step pages. |
| Local software-testing and development references | Review individually; retain only official or owner-authorized testing material. | Android/Apple/Windows simulator references already curated in Research Sandbox. |
| Media/document evidence education | Review individually with a no-upload/no-private-media caution. | FotoForensics. |
| Authorized testing standards | Review individually; retain documentation standards, not scanning or exploitation tools. | Penetration Testing Execution Standard. |

## Full category audit

The supplied page displayed **170 external links** across the following eleven groups. The counts below are link counts on the page at review time, not endorsements of any destination.

| Directory group | Links | Decision | Rationale |
|---|---:|---|---|
| Top links | 26 | **3 included; 23 excluded** | One-Step Webpages, LECA E-Status Check, and PTES are individually scoped below. The remaining links are unreviewed aggregators, non-research utilities, upload-based analysis, comment export, financial validation, device/telecom content, network intelligence, or offensive material. |
| Phone number verification tools | 4 | Excluded | Phone-number/operator/HLR-style lookup conflicts with the platform’s no-targeting boundary. |
| Location of base stations | 4 | Excluded | Base-station location data may enable person/device location inference. |
| Geolocating smartphone by logging | 4 | Excluded | Tracking and logging links are not permitted. |
| Other logging tools | 6 | Excluded | Link/file/PDF/IP tracking can be invasive and is not permitted. |
| Geolocating smartphone by OS | 3 | Excluded | Device-location access is outside scope. |
| IMEI check | 7 | Excluded | Device-identifier lookup is outside scope. |
| Online services / password recovery | 8 | Excluded | Credential and account-recovery workflows are outside scope. |
| Pentest cheat sheets | 57 | Excluded | The page does not host technical scanning, exploitation, or offensive-security tool collections. |
| Dark web | 15 | Excluded | Dark-web and evasion-oriented resources are outside scope. |
| Copy of OSINT & threat intel | 36 | Excluded | The group is an unreviewed mixed tool index that can include invasive or target-specific pivots; the Hub uses individually verified links instead. |

## Excluded categories

Phone OSINT, number/operator/HLR lookups, base-station lookup, device/IMEI lookup, smartphone location, tracking/link/file logging, IP loggers, password-recovery destinations, account takeover, reverse shells, telecom signaling, eSIM exploitation, dark-web resources, public/private scanning services, exploit/pentest collections, and credit-card validation are excluded.

## Next review step

Each eligible candidate will be opened only to verify its public scope and destination. Included cards will state their source, purpose, and an explicit lawful-use boundary. No external service will be called by the Ontario Research Hub itself.

## Verified additions

| Included destination | Curated category | Verified scope | In-app boundary |
|---|---|---|---|
| [Stephen P. Morse One-Step Webpages](https://stevemorse.org/index.html) | Archive and historical-record methods | The directory identifies the site as tools for immigration, census, vital-record, calendar, map, and alphabet research. | Use only public or lawfully accessible historical records; do not create records or dossiers about living private individuals. |
| [LECA E-Status Check](https://complaint.leca.ca/LECA.Estatus/check_en.php) | Ontario regulatory status | The page accepts a file number from a user’s own correspondence to display its current complaint status. | Enter only a file number you are authorized to use; no information is submitted to or stored by the Hub. |
| [Penetration Testing Execution Standard](http://www.pentest-standard.org/index.php/Main_Page) | Authorized testing governance | The standard describes pre-engagement, scope, analysis, and reporting components of a penetration-test engagement. | This Hub links to the high-level governance reference only; it does not provide scanning, exploitation, or testing tools. |

FotoForensics was not added because it requires a third-party upload and conflicts with the Hub’s local-first evidence preference. The Start.me directory’s comment-export, phone/device, tracking, credential, exploit, dark-web, and scanner links remain excluded.
