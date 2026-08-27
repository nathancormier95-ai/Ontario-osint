import { describe, expect, it } from "vitest";
import { sectionNav, tableOfContentsGroups, tableOfContentsMeta } from "./Home";

describe("home-page table of contents", () => {
  it("covers every primary navigation destination exactly once", () => {
    const indexedIds = sectionNav.map((section) => section.id);

    expect(Object.keys(tableOfContentsMeta).sort()).toEqual([...indexedIds].sort());
    expect(new Set(indexedIds).size).toBe(indexedIds.length);
  });

  it("places each table-of-contents route inside a declared purpose group", () => {
    const groupIds = new Set(tableOfContentsGroups.map((group) => group.id));

    expect(sectionNav.every((section) => groupIds.has(tableOfContentsMeta[section.id].group))).toBe(true);
  });
});
