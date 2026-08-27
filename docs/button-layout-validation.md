# Button Layout Validation

## Scope

The visual action system was reviewed after standardizing component-library buttons and remaining direct controls. The update uses Ontario Lake teal for primary actions, light outlined secondary actions, compact source-ledger filters, field-note selector tabs, and consistent press, hover, and keyboard-focus feedback.

## Verified views

| Route | Desktop review | Phone-sized review (`390×844`) |
| --- | --- | --- |
| Home | Hero actions, Print / Save PDF action, and the 11 sitemap buttons retain clear hierarchy and aligned call-to-action positions. | Primary and secondary actions stack at full width; sitemap boxes remain individually readable and reachable. |
| Source ledger | Category filters remain distinct from resource cards; 24 direct resources render in a stable two-column ledger. | Filter chips wrap without horizontal clipping; the full resource set remains single-column and readable. |
| Ontario data | Data-focus filters have a consistent selected state and the official-source cards remain visually secondary to the filter controls. | Filter chips wrap into compact rows above the source cards without overlapping content. |
| Research guide | Research-lane buttons, Clear control, and send action preserve visual hierarchy. | The lane controls and chat composer remain visible and touch-friendly with no overlap. |

## Component coverage

The shared `Button` component now provides the baseline shape, sizing, focus ring, shadow, hover lift, and active press state. The home shell, mobile and desktop rail, sitemap, workbench tabs, source filters, copilot prompt controls, error recovery view, dashboard template controls, and template chat prompts use either the shared component or the compatible field-note treatment. No navigation, account, citation, or assistant behaviors were changed.
