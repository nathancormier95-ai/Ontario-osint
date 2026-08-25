import { describe, expect, it } from "vitest";
import { syncedCitationSchema } from "./citationSync";

describe("syncedCitationSchema", () => {
  const validCitation = {
    id: "3d4c406e-75df-4cfe-a173-460675c8d5b9",
    sourceTitle: "Ontario Business Registry",
    sourceUrl: "https://www.ontario.ca/page/ontario-business-registry",
    accessedOn: "2026-08-25",
    purpose: "Confirm public registration details",
    notes: "Official entry point.",
    savedAt: "2026-08-25T14:00:00.000Z",
  };

  it("accepts a source-focused citation and rejects a malformed source URL", () => {
    expect(syncedCitationSchema.safeParse(validCitation).success).toBe(true);
    expect(syncedCitationSchema.safeParse({ ...validCitation, sourceUrl: "not a URL" }).success).toBe(false);
  });
});
