import { describe, expect, it } from "vitest";
import { prepareAssistantMessages, researchAssistantInstructions } from "./aiAssistant";

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
