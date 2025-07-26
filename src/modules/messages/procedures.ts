import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

/**
 * Router that handles all “messages”-related procedures.
 */
export const messagesRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, "Message cannot be empty"),
      }),
    )
    .mutation(async ({ input }) => {
      // 1. Persist the message
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      // 2. Kick off the background job via Inngest
      await inngest.send({
        name: "test/hello.world",
        data: { value: input.value },
      });

      // 3. Return the DB record so the client can update instantly
      return createdMessage;
    }),
});

/** In case you want to import the type elsewhere */
export type MessagesRouter = typeof messagesRouter;
