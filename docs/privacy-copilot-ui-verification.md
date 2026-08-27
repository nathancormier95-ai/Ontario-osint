# Privacy Resources and Research Copilot Bubble — UI Verification

## Desktop bubble behavior

The fixed **Ask the copilot** button is visible at the bottom-right of the workspace without covering the page footer or sidebar. Opening it presents a centered, keyboard-operable dialog with an Ontario Research Copilot heading, a concise safety/session statement, and a clear sign-in requirement when the visitor is signed out.

The signed-out dialog does not show a chat field or make an LLM request. It directs the visitor to authenticate before sending a question and states that the panel does not retain chat history after close or refresh.

## Privacy page

The Privacy & Personal Security route displays the curated defensive cards, a visible warning that excluded categories are not reproduced, filter controls, and cross-links to the local Research Sandbox and Responsible Use protocol.

After the final audit pass, the desktop page presents ten curated cards across five filters. The two self-directed Digital Privacy Review references appear with their own category label and own-data-only boundaries, while the excluded-service notice remains visible beside the source ledger.

## Mobile

At `390×844`, the menu trigger remains visible, the fixed copilot control sits above the lower edge without obscuring the privacy routine, and the heading, exclusion boundary, and defensive-purpose copy remain readable. The compact icon-only bubble preserves the action while avoiding a mobile-width overlay.

## Mobile popup state

At `390×844` with the explicit copilot preview state, the dialog fits inside the viewport, exposes its close control in the header, preserves the assistant’s source-first safety notice, and keeps the three guided starter actions plus text entry visible. The panel intentionally overlays the page while open; closing it resets the in-memory session through the tested session-version guard.

The phone-sized interaction check then activated the header close control. The dialog dismissed cleanly, returning focus and unobstructed access to the Privacy & Personal Security filters and ten resource cards; the compact copilot bubble remained available for a new, fresh session.
