import { describe, expect, it } from "vitest";
import { normalizeDomain } from "./EvidenceTools";

describe("normalizeDomain", () => {
  it("normalizes a host and rejects URLs with paths or IP addresses", () => {
    expect(normalizeDomain("https://www.example.ca/path")).toBe("example.ca");
    expect(normalizeDomain("192.0.2.10")).toBeNull();
    expect(normalizeDomain("example")).toBeNull();
  });
});
