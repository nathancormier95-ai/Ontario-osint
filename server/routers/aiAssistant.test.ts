import { describe, expect, it } from "vitest";
import { assistantGuideSchema, parseAssistantGuide, prepareAssistantMessages, researchAssistantInstructions } from "./aiAssistant";

describe("prepareAssistantMessages", () => {
  it("adds the safety-bounded research instruction and keeps only recent messages", () => {
    const messages = Array.from({ length: 10 }, (_, index) => ({
      role: index % 2 === 0 ? "user" as const : "assistant" as const,
      content: `Message ${index + 1}`,
    }));

    const result = prepareAssistantMessages(messages);

    expect(result).toHaveLength(9);
    expect(result[0]).toEqual({ role: "system", content: researchAssistantInstructions });
    expect(result[1]).toEqual({ role: "user", content: "Message 3" });
    expect(result.at(-1)).toEqual({ role: "assistant", content: "Message 10" });
  });
});

describe("assistant guide response contract", () => {
  const guide = {
    headline: "Verify the organization first",
    summary: "Start with the issuing registry and keep the review tied to a documented business purpose.",
    steps: ["Write the organization name and research purpose.", "Open the relevant public registry and verify the issuer.", "Record only the source fields needed for the stated question."],
    sourceCue: "Use the Ontario Business Registry for an entity-first check.",
    citationCue: "Record the registry name, URL, access date, result context, and any stated limitations.",
    safetyNote: "Avoid building a profile of individuals from registry material.",
    route: "registry-guide",
  };

  it("accepts a compact structured research brief", () => {
    expect(assistantGuideSchema.parse(guide)).toEqual(guide);
    expect(parseAssistantGuide(JSON.stringify(guide))).toEqual(guide);
  });

  it("rejects unsupported in-app routes", () => {
    expect(() => assistantGuideSchema.parse({ ...guide, route: "person-lookup" })).toThrow();
    expect(() => assistantGuideSchema.parse({ ...guide, route: "responsible-use" })).toThrow();
  });
});
