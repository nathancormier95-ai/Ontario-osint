# Uploaded Tool Archive Review

The uploaded `osint-scanner-platform-main.zip` was reviewed as source material only; no included scripts, servers, scanners, or containers were executed. The archive includes high-risk lookup, scanning, credential, telecom, financial, plate, and scraping modules that are not appropriate for a general public research site.

| Archive concept | Ontario Research Hub adaptation | Boundary |
| --- | --- | --- |
| `DomainOsint.tsx` | **Public domain sources** launcher for ICANN Lookup and certificate-transparency records. | The Hub does not perform DNS, WHOIS, subdomain, SSL, port, or active network scans. A user-controlled external tab opens only after domain validation. |
| `FileAnalyzer.tsx` | **Local file evidence** utility for SHA-256, first bytes, and browser-visible file facts. | File bytes remain in the browser; the Hub does not upload, execute, store, or label files as safe/malicious. |
| `VINDecoder.tsx` | **Public vehicle reference** workflow that validates a VIN locally and opens the official NHTSA vPIC specification endpoint only after user acknowledgement. | The Hub does not save or transmit the VIN, and the workflow excludes owner, plate, location, insurance, or vehicle-history lookup. |
| Phone, IMEI, SIM-swap, credit-card, and licence-plate modules | Not adapted. | These involve sensitive telecom, financial, device, or vehicle information and could facilitate fraud, stalking, or unauthorized access. |
| Scraping, password, port, vulnerability, IoT, Shodan, subdomain, and takeover modules | Not adapted. | These could enable intrusive scanning, unauthorized reconnaissance, exploitation, or evasion. |
| Virtual phone, sock-puppet, temporary-email, and VPN modules | Not adapted. | These can enable deception, impersonation, or account/platform abuse. |

The resulting Evidence Tools section is intentionally source-led, local-first, and designed for lawful, authorized research only.

## Vehicle-specification reference

The VIN adaptation uses the official [NHTSA vPIC VIN Decoder](https://vpic.nhtsa.dot.gov/decoder/) and its documented [Decode VIN Extended API](https://vpic.nhtsa.dot.gov/api/). vPIC describes the output as vehicle information encoded in a VIN and notes that the data is reported by manufacturers; it is not an owner, plate, location, insurance, or vehicle-history service.
