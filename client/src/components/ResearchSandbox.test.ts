import { describe, expect, it } from "vitest";
import { getSandboxCompletion, type SandboxChecks } from "./ResearchSandbox";

describe("Research Sandbox checklist", () => {
  it("counts only the local safety checks that have been confirmed", () => {
    const partial: SandboxChecks = { authorized: true, testData: false, localNotes: true };
    expect(getSandboxCompletion(partial)).toBe(2);
    expect(getSandboxCompletion({ authorized: true, testData: true, localNotes: true })).toBe(3);
  });
});
