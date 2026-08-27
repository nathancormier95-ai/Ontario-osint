import { describe, expect, it } from "vitest";
import { filterCuratedPrivacyResources } from "./PrivacyResources";

describe("curated privacy resources", () => {
  it("limits the privacy page to reviewed defensive categories", () => {
    expect(filterCuratedPrivacyResources("All")).toHaveLength(10);
    expect(filterCuratedPrivacyResources("Private browsing").map((item) => item.title)).toEqual(["DuckDuckGo", "Startpage"]);
    expect(filterCuratedPrivacyResources("Password hygiene").map((item) => item.title)).toEqual(["KeePass Password Safe", "1Password"]);
    expect(filterCuratedPrivacyResources("Digital privacy review").map((item) => item.title)).toEqual(["Google Results About You", "EFF Cover Your Tracks"]);
  });
});
