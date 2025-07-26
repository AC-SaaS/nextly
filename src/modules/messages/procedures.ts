import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";


export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .query(async() => {
      const messages = await prisma.message.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          fragment: true,
        }
      });
      
      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, "Message cannot be empty"),
      }),
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: { value: input.value },
      });

      return createdMessage;
    }),
});

export type MessagesRouter = typeof messagesRouter;
