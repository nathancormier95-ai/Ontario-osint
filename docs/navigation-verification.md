
## Scrollbar fix

The desktop sidebar was reviewed at `1280×720`. The navigation is now an independent flex region with `min-height: 0`, persistent vertical scrolling, reserved scrollbar space, and a high-contrast teal scrollbar track/thumb. Account, protocol, and support controls remain outside the scrolling list so the full section list can be reached without moving those controls. The same scroll treatment is applied to the mobile drawer navigation.

The post-fix mobile review at `390×667` confirms the compact header and Menu trigger remain visible at a short viewport. The drawer uses the same independent scrollable navigation region, with the account/support block kept separate from the list so the last destination can be reached by scrolling.
