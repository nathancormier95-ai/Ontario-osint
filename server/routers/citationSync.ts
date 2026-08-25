import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { disconnectCitationSync, enableCitationSync, getCitationSyncState, replaceSyncedCitations } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const syncedCitationSchema = z.object({
  id: z.string().uuid(),
  sourceTitle: z.string().trim().min(1).max(500),
  sourceUrl: z.string().url().max(2_000),
  accessedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  purpose: z.string().max(2_000),
  notes: z.string().max(10_000),
  savedAt: z.string().datetime({ offset: true }),
});

const syncInputSchema = z.object({ entries: z.array(syncedCitationSchema).max(500) });

function unavailable() {
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Citation sync storage is unavailable. Your browser-local log has not been changed." });
}

export const citationSyncRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    const state = await getCitationSyncState(ctx.user.id);
    if (!state) throw unavailable();
    return state;
  }),
  enable: protectedProcedure.input(z.object({ consentConfirmed: z.literal(true) })).mutation(async ({ ctx }) => {
    const state = await enableCitationSync(ctx.user.id);
    if (!state) throw unavailable();
    return state;
  }),
  replace: protectedProcedure.input(syncInputSchema).mutation(async ({ ctx, input }) => {
    const state = await replaceSyncedCitations(ctx.user.id, input.entries);
    if (state === null) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Enable citation sync before uploading citations." });
    }
    if (!state) throw unavailable();
    return state;
  }),
  disconnectAndDelete: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await disconnectCitationSync(ctx.user.id);
    if (result === undefined) throw unavailable();
    return { success: true } as const;
  }),
});
