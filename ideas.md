# Ontario Research Hub — Design Direction

## Three visual approaches

### 1. Civic Field Notes
**Very Brief Intro:** An editorial research desk inspired by Ontario public-library archives, municipal maps, and investigative notebooks. It feels methodical, grounded, and calm rather than surveillance-oriented.
**Probability:** 0.07

### 2. Signal Cabinet
**Very Brief Intro:** A compact digital instrument panel using deep charcoal, electric signal accents, and dense technical visual language. It conveys rapid triage and operational awareness.
**Probability:** 0.04

### 3. Provincial Ledger
**Very Brief Intro:** A contemporary institutional portal with stone, ink, and restrained red accents, drawing from government briefings and legal research reports. It feels authoritative and deliberately low-drama.
**Probability:** 0.09

## Selected approach: Civic Field Notes

### Design Movement
**Modern editorial utilitarianism** informed by municipal archive materials, Canadian public-library wayfinding, and field-journal typography.

### Core Principles
1. **Evidence over spectacle:** Interfaces expose source, purpose, and responsible-use context before an action.
2. **Controlled density:** Rich tools and resources appear in clear, scannable bands rather than generic card grids.
3. **Human-scale research:** Warm paper tones and field-note cues prevent the experience from feeling like a surveillance dashboard.
4. **Calm accountability:** Legibility, consent prompts, and safe defaults are visual features—not legal footnotes.

### Color Philosophy
The default surface is a softly warm document stock, creating a credible public-records tone. **Ontario Lake**—a saturated, deep teal-blue—is the ownable action color, paired with ink black, clay red for cautions, and faded conifer green for verified/ethical cues. The palette favors contrast and restraint over data-broker aesthetics.

### Layout Paradigm
The site behaves like an **unfolding case file**: a narrow left rail anchors context and navigation, while the main page uses offset “document panels,” field-note strips, and an asymmetric two-column research workbench. Sections overlap subtly through ruled-paper dividers rather than conventional centered hero-plus-grid structures.

### Signature Elements
1. Fine **map-grid and contour-line texture** behind the hero.
2. A vertical **field note margin** that carries status, section numbers, and short ethical reminders.
3. Small **source-stamp labels** marking public sources, exported searches, and configurable services.

### Interaction Philosophy
Actions should be explicit and reversible. A user chooses a discovery method, sees what will be searched, then opens an external source in a new tab. Inputs never silently collect or transmit identifiers; consent acknowledgement is visible for sensitive lookup workflows.

### Animation
Use 160–240ms transform-and-opacity transitions with a firm ease-out. Document panels should lift by 2–4px on hover; source-stamp labels gently shift into view; the navigation rail receives no decorative animation. Respect `prefers-reduced-motion` by disabling all nonessential motion.

### Typography System
**Fraunces** provides high-contrast, thoughtful display moments for headlines and section starts. **IBM Plex Sans** provides precise, technical readability for search labels, navigation, resource metadata, and body copy. Small-cap letter spacing is reserved for provenance and status marks.

### Brand Essence
**Ontario Research Hub is a responsible starting point for researchers who need to locate public Ontario sources and structured social-context leads without turning people into data.**

Personality: **methodical, civic-minded, clear-eyed**.

### Brand Voice
Headlines speak like an experienced research librarian: concise, useful, and uninflated. CTAs describe the next action and the destination, not a vague benefit.

Example lines: “Start with a source you can cite.” and “Open a public profile search—nothing is submitted here.”

### Wordmark & Logo
The mark is a **teal north-arrow lens**: a simplified compass arrow intersecting a circular document lens, with a subtle inset grid. The wordmark pairs the mark with a deliberately editorial serif title, avoiding a default UI-font lockup.

### Signature Brand Color
**Ontario Lake — #0F5974**

## Product and safety decisions

This front-end directory supports **lawful, consent-based research and public-source discovery**. It will not claim to identify, verify, enrich, scrape, or profile a person. The name workflow assembles user-controlled external searches; the social workflow opens platform search pages from an exact public handle or name; and the email workflow offers a local format check and links to approved, user-supplied email security tools. No identifiers are stored, sent to a first-party backend, or combined into a dossier.

PayPal is implemented as a configurable client-side checkout placeholder for a digital membership or resource contribution. Before accepting live payments, the site operator must replace the placeholder client ID, set the amount/currency, and provide final terms, privacy, and refund information.
