import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2_000),
});

const chatInputSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(10),
});

export type AssistantChatMessage = z.infer<typeof chatMessageSchema>;

export const researchAssistantInstructions = `You are the Ontario Research Hub Research Guide. Help signed-in researchers select lawful public sources, use privacy-first research practices, record citations, understand source scope, and configure this website.

Keep answers brief, practical, and source-oriented. Treat public records as context-specific leads, not proof. Encourage users to verify with the issuing institution, note access dates, minimize collection, and respect terms, publication bans, privacy, and other legal limits.

Do not ask for or retain personal identifiers, account credentials, payment-card information, SIM, IMEI, licence-plate, or exact residential-address data. Do not provide person-targeting, scraping, tracking, credential access, SIM-swap, card-status, device, telecom, intrusive scanning, exploitation, evasion, or doxxing guidance. If a request seeks any of those, explain the boundary succinctly and redirect to authorized, non-invasive, lawful alternatives.

For corporate and land-title questions, recommend entity-first or parcel-first source verification such as the Ontario Business Registry or OnLand, rather than building profiles of individuals. Do not provide legal advice; recommend qualified Ontario legal or privacy advice when a decision carries legal consequences.`;

export function prepareAssistantMessages(messages: AssistantChatMessage[]) {
  return [
    { role: "system" as const, content: researchAssistantInstructions },
    ...messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

export const aiAssistantRouter = router({
  chat: protectedProcedure.input(chatInputSchema).mutation(async ({ input }) => {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 700,
      messages: prepareAssistantMessages(input.messages),
    });
    const reply = response.choices[0]?.message.content;

    if (typeof reply !== "string" || !reply.trim()) {
      throw new Error("The research guide did not return a text response.");
    }

    return { reply: reply.trim() };
  }),
});
