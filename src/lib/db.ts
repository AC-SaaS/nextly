import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientWithExtensions>;
};

function prismaClientWithExtensions() {
  return new PrismaClient().$extends(withAccelerate());
}

const prisma = globalForPrisma.prisma ?? prismaClientWithExtensions();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
