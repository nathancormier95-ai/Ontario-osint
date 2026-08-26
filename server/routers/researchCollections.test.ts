import { describe, expect, it } from "vitest";
import { collectionInputSchema } from "./researchCollections";

describe("research collection validation", () => {
  it("accepts bounded collection details and rejects an unsupported accent", () => {
    expect(collectionInputSchema.parse({ name: "Supplier review", description: "Account-backed citations only.", accent: "teal" })).toMatchObject({ name: "Supplier review", accent: "teal" });
    expect(() => collectionInputSchema.parse({ name: "Valid", description: "", accent: "red" })).toThrow();
  });
});
