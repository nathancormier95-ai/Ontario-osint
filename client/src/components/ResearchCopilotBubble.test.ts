import { describe, expect, it } from "vitest";
import { COPILOT_BUBBLE_STARTERS, createFreshCopilotBubbleSession, isActiveCopilotBubbleSession, shouldOpenResearchCopilotFromSearch } from "./ResearchCopilotBubble";

describe("research copilot bubble", () => {
  it("offers only source-first Ontario research starters", () => {
    expect(COPILOT_BUBBLE_STARTERS).toHaveLength(3);
    expect(COPILOT_BUBBLE_STARTERS.join(" ").toLowerCase()).toContain("ontario");
    expect(COPILOT_BUBBLE_STARTERS.join(" ").toLowerCase()).not.toMatch(/phone|imei|password|scan|track/);
  });

  it("starts each popup session with only the safety-bounded opening message", () => {
    const firstSession = createFreshCopilotBubbleSession();
    const nextSession = createFreshCopilotBubbleSession();

    expect(firstSession).toHaveLength(1);
    expect(nextSession).toHaveLength(1);
    expect(firstSession).not.toBe(nextSession);
    expect(firstSession[0]?.content).toContain("Do not enter personal identifiers");
  });

  it("drops a stale response after the popup session is closed and reset", () => {
    expect(isActiveCopilotBubbleSession(4, 4)).toBe(true);
    expect(isActiveCopilotBubbleSession(4, 5)).toBe(false);
  });

  it("opens only when the optional copilot URL flag is explicitly present", () => {
    expect(shouldOpenResearchCopilotFromSearch("")).toBe(false);
    expect(shouldOpenResearchCopilotFromSearch("?copilot=open")).toBe(true);
    expect(shouldOpenResearchCopilotFromSearch("?copilot=closed")).toBe(false);
  });
});
