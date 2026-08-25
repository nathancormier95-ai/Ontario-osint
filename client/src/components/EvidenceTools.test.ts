import { describe, expect, it } from "vitest";
import { normalizeDomain, normalizeVin } from "./EvidenceTools";

describe("normalizeDomain", () => {
  it("normalizes a host and rejects URLs with paths or IP addresses", () => {
    expect(normalizeDomain("https://www.example.ca/path")).toBe("example.ca");
    expect(normalizeDomain("192.0.2.10")).toBeNull();
    expect(normalizeDomain("example")).toBeNull();
  });
});

describe("normalizeVin", () => {
  it("normalizes a standard VIN and rejects invalid characters or length", () => {
    expect(normalizeVin("1HGBH41JXMN109186")).toBe("1HGBH41JXMN109186");
    expect(normalizeVin("1HGBH41JXMN10918I")).toBeNull();
    expect(normalizeVin("1HGBH41JXMN10918")).toBeNull();
  });
});
