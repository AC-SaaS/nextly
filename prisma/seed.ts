import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.message.create({
    data: {
      content: "Hello",
      role: "USER",
      type: "RESULT",
    },
  });

  console.log("Seeded:", alice);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
