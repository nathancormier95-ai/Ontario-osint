/**
 * Civic Field Notes style reminder: configuration is explicit, calm, and non-invasive.
 * The hosted PayPal link is intentionally the only payment connection for this static site.
 */
export const siteConfig = {
  paypalCheckoutUrl:
    "https://www.paypal.com/donate/?hosted_button_id=REPLACE_WITH_YOUR_PAYPAL_BUTTON_ID",
  siteName: "Ontario Research Hub",
  supportLabel: "Support the resource desk",
} as const;

export const isPayPalConfigured = !siteConfig.paypalCheckoutUrl.includes(
  "REPLACE_WITH_YOUR_PAYPAL_BUTTON_ID",
);
