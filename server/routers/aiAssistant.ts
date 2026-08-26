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

const assistantRouteSchema = z.enum([
  "workbench",
  "evidence-tools",
  "sources",
  "ontario-data",
  "registry-guide",
  "citation-log",
  "responsible-use",
]);

export const assistantGuideSchema = z.object({
  headline: z.string().trim().min(3).max(96),
  summary: z.string().trim().min(20).max(480),
  steps: z.array(z.string().trim().min(8).max(180)).min(2).max(4),
  sourceCue: z.string().trim().min(8).max(180),
  citationCue: z.string().trim().min(8).max(180),
  safetyNote: z.string().trim().min(8).max(180),
  route: assistantRouteSchema,
});

export type AssistantChatMessage = z.infer<typeof chatMessageSchema>;
export type AssistantGuide = z.infer<typeof assistantGuideSchema>;

export const researchAssistantInstructions = `You are the Ontario Research Hub Research Copilot. Help signed-in researchers plan lawful, privacy-first, source-oriented research related to Ontario public information.

Return a compact, practical research brief in the required JSON schema. Use the user's stated research purpose and select the most relevant next in-app route. Give 2 to 4 action steps that begin with a verb. Mention an official source direction only when it fits: Ontario Business Registry for an organization, OnLand for a parcel/title question, Ontario Data Catalogue for provincial datasets, Ontario GeoHub for authoritative maps and spatial layers, Statistics Canada Census Profile for aggregate population geography, or a municipality's official open-data portal.

Treat public records and datasets as context-specific leads, not proof. Encourage researchers to verify with the issuing institution, note access dates and field definitions, minimize collection, and respect licences, terms, publication bans, privacy, and legal limits. The citation cue must describe what to record; do not invent source facts, legal conclusions, or current dataset values.

Do not ask for or retain personal identifiers, account credentials, payment-card information, SIM, IMEI, licence-plate, or exact residential-address data. Do not provide person-targeting, scraping, tracking, credential access, SIM-swap, card-status, device, telecom, intrusive scanning, exploitation, evasion, or doxxing guidance. If a request seeks any of those, state the boundary in the summary, provide a non-invasive lawful alternative, and choose the responsible-use route. For corporate and land-title questions, recommend entity-first or parcel-first verification rather than building profiles of individuals. Do not provide legal advice; recommend qualified Ontario legal or privacy advice when a decision carries legal consequences.`;

export function prepareAssistantMessages(messages: AssistantChatMessage[]) {
  return [
    { role: "system" as const, content: researchAssistantInstructions },
    ...messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

export function parseAssistantGuide(content: unknown): AssistantGuide {
  if (typeof content !== "string") throw new Error("The research copilot did not return text.");
  return assistantGuideSchema.parse(JSON.parse(content));
}

export const aiAssistantRouter = router({
  chat: protectedProcedure.input(chatInputSchema).mutation(async ({ input }) => {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 900,
      messages: prepareAssistantMessages(input.messages),
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ontario_research_guide",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline: { type: "string" },
              summary: { type: "string" },
              steps: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
              sourceCue: { type: "string" },
              citationCue: { type: "string" },
              safetyNote: { type: "string" },
              route: { type: "string", enum: ["workbench", "evidence-tools", "sources", "ontario-data", "registry-guide", "citation-log", "responsible-use"] },
            },
            required: ["headline", "summary", "steps", "sourceCue", "citationCue", "safetyNote", "route"],
            additionalProperties: false,
          },
        },
      },
    });

    const guide = parseAssistantGuide(response.choices[0]?.message.content);
    return { reply: guide.summary, guide };
  }),
});
