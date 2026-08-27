import { describe, expect, it } from "vitest";
import { resources } from "./resources";

describe("resource ledger curation", () => {
  it("includes the reviewed official entity and account-owner resources", () => {
    const titles = resources.map((resource) => resource.title);

    expect(titles).toEqual(expect.arrayContaining([
      "Canada’s Business Registries",
      "Corporations Canada · Federal Corporation Search",
      "CRA List of Charities",
      "Canadian Trademarks Database",
      "Canadian Patents Database",
      "Ontario IPC · Access and Correction Rights",
      "Privacy Commissioner of Canada · Access Your Information",
      "Google Takeout · Your Account Data",
      "LinkedIn · Download Your Account Data",
      "Facebook · Export Your Information",
    ]));
  });

  it("labels personal-information resources as self-service privacy guidance", () => {
    const selfServiceResources = resources.filter((resource) => resource.category === "Self-service privacy");

    expect(selfServiceResources).toHaveLength(5);
    expect(selfServiceResources.every((resource) => /own|account-owner/i.test(`${resource.description} ${resource.note}`))).toBe(true);
  });

  it("does not introduce prohibited person-targeting or invasive resource titles or destinations", () => {
    const ledgerText = resources.map((resource) => `${resource.title} ${resource.href}`).join(" ").toLowerCase();

    expect(ledgerText).not.toMatch(/phone lookup|imei|sim swap|credit card|licence plate lookup|device lookup|password recovery|dark web|reverse shell|scrap(?:e|ing)/);
  });
});
