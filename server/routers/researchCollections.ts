/** Account-backed collection routing; all citation content remains owned by the authenticated user. */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { assignCitationToCollection, createResearchCollection, deleteResearchCollection, getResearchCollectionState, removeCitationFromCollection, updateResearchCollection } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const collectionInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2_000),
  accent: z.enum(["teal", "coral", "violet", "gold", "blue"]),
});

const collectionIdSchema = z.string().uuid();
const assignmentSchema = z.object({ collectionId: collectionIdSchema, citationId: z.string().uuid() });

function storageUnavailable() {
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Research collection storage is unavailable. Your local citation log has not changed." });
}

function syncRequired() {
  return new TRPCError({ code: "FORBIDDEN", message: "Enable explicit citation sync before creating an account-backed collection." });
}

export const researchCollectionsRouter = router({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const state = await getResearchCollectionState(ctx.user.id);
    if (!state) throw storageUnavailable();
    return state;
  }),
  create: protectedProcedure.input(collectionInputSchema).mutation(async ({ ctx, input }) => {
    const state = await createResearchCollection(ctx.user.id, input);
    if (state === undefined) throw storageUnavailable();
    if (state === null) throw syncRequired();
    return state;
  }),
  update: protectedProcedure.input(z.object({ id: collectionIdSchema, collection: collectionInputSchema })).mutation(async ({ ctx, input }) => {
    const state = await updateResearchCollection(ctx.user.id, input.id, input.collection);
    if (state === undefined) throw storageUnavailable();
    if (state === null) throw new TRPCError({ code: "NOT_FOUND", message: "That collection is not available in your account." });
    return state;
  }),
  delete: protectedProcedure.input(z.object({ id: collectionIdSchema })).mutation(async ({ ctx, input }) => {
    const state = await deleteResearchCollection(ctx.user.id, input.id);
    if (state === undefined) throw storageUnavailable();
    if (state === null) throw new TRPCError({ code: "NOT_FOUND", message: "That collection is not available in your account." });
    return state;
  }),
  assignCitation: protectedProcedure.input(assignmentSchema).mutation(async ({ ctx, input }) => {
    const state = await assignCitationToCollection(ctx.user.id, input.collectionId, input.citationId);
    if (state === undefined) throw storageUnavailable();
    if (state === null) throw new TRPCError({ code: "NOT_FOUND", message: "Use citations and collections stored in your own account." });
    return state;
  }),
  removeCitation: protectedProcedure.input(assignmentSchema).mutation(async ({ ctx, input }) => {
    const state = await removeCitationFromCollection(ctx.user.id, input.collectionId, input.citationId);
    if (state === undefined) throw storageUnavailable();
    if (state === null) throw new TRPCError({ code: "NOT_FOUND", message: "That collection is not available in your account." });
    return state;
  }),
});
