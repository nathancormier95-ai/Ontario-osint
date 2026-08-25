import { describe, expect, it } from "vitest";
import { analyzeLocalFile, buildDomainSourceUrl, buildVinReferenceUrl, CANADIAN_VEHICLE_SPECS_URL, canAnalyzeLocalFileSize, copyEvidenceHash, isVinReferenceAuthorized, MAX_LOCAL_FILE_BYTES, normalizeDomain, normalizeVin } from "./EvidenceTools";

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

describe("external evidence destinations", () => {
  it("builds the intended public-source destinations without adding user data elsewhere", () => {
    expect(buildDomainSourceUrl("example.ca", "icann")).toBe("https://lookup.icann.org/en/lookup?name=example.ca");
    expect(buildDomainSourceUrl("example.ca", "certificates")).toBe("https://crt.sh/?q=%25.example.ca");
    expect(buildVinReferenceUrl("1HGBH41JXMN109186")).toBe("https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/1HGBH41JXMN109186?format=json");
    expect(CANADIAN_VEHICLE_SPECS_URL).toBe("https://vpic.nhtsa.dot.gov/decoder/CaVehSpec?year=2026");
  });
});

describe("VIN acknowledgement gate", () => {
  it("requires both a valid VIN and an affirmative acknowledgement", () => {
    expect(isVinReferenceAuthorized("1HGBH41JXMN109186", false)).toBe(false);
    expect(isVinReferenceAuthorized("1HGBH41JXMN109186", true)).toBe(true);
    expect(isVinReferenceAuthorized("invalid", true)).toBe(false);
  });
});

describe("local file evidence", () => {
  it("hashes and inspects browser-provided file bytes without an upload", async () => {
    const file = new File(["abc"], "note.txt", { type: "text/plain", lastModified: 0 });
    const evidence = await analyzeLocalFile(file);

    expect(evidence.name).toBe("note.txt");
    expect(evidence.size).toBe(3);
    expect(evidence.sha256).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(evidence.magicBytes).toBe("61 62 63");
  });

  it("enforces the local-only file-size limit and copies a prepared hash through the browser clipboard adapter", async () => {
    expect(canAnalyzeLocalFileSize(MAX_LOCAL_FILE_BYTES)).toBe(true);
    expect(canAnalyzeLocalFileSize(MAX_LOCAL_FILE_BYTES + 1)).toBe(false);

    const copied: string[] = [];
    await copyEvidenceHash("abc123", async (value) => { copied.push(value); });
    expect(copied).toEqual(["abc123"]);
  });
});
