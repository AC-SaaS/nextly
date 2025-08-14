import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { 
  createTRPCRouter, 
  protectedProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, {message: "Project ID is required"}),
      }),
    )
    .query(async({ input, ctx }) => {
      const exsitingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!exsitingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }
      
      return exsitingProject;
    }),

  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const projects = await prisma.project.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      
      return projects;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z.string()
          .min(1, "Prompt cannot be empty")
          .max(1000, "Prompt cannot be longer than 1000 characters"),
      }),
    )
    .mutation(async ({ input, ctx }) => {

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
        } else {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have reached your limit of requests" });
        }
      }

      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            }
          }
        }
      })

      await inngest.send({
        name: "code-agent/run",
        data: { 
            value: input.value,
            projectId: createdProject.id 
        },
      });

      return createdProject;
    }),
});
