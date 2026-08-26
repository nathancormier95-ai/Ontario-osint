import { describe, expect, it } from "vitest";
import { filterCuratedOsintResources } from "./OsintResources";

describe("curated OSINT resources", () => {
  it("keeps the directory page limited to the reviewed resource categories", () => {
    expect(filterCuratedOsintResources("All")).toHaveLength(3);
    expect(filterCuratedOsintResources("Ontario & regulatory").map((item) => item.title)).toEqual(["LECA E-Status Check"]);
    expect(filterCuratedOsintResources("Archive methods").map((item) => item.title)).toEqual(["One-Step Webpages"]);
  });
});
