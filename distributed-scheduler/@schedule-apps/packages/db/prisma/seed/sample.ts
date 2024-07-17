import { PrismaClient, Frequency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create user for reference
  const user = await prisma.user.upsert({
    where: { name: "root" },
    update: {},
    create: {
      name: "root",
      createdBy: "system",
      updatedBy: "system",
    },
  });

  // Create first schedule record with cron expression to run every minute
  await prisma.schedule.create({
    data: {
      description: "First Schedule",
      ownerId: user.id,
      frequency: Frequency.Once,
      nextRun: new Date(),
      recurringRule: "* * * * *", // Cron expression to run every minute
      executorType: "shell",
      executorProperties: "echo 'Hello World'",
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  // Create second schedule record
  await prisma.schedule.create({
    data: {
      description: "Second Schedule",
      ownerId: user.id,
      frequency: Frequency.Recurring,
      nextRun: new Date(),
      recurringRule: "0 16 12 23 8 *",
      executorType: "http",
      executorProperties: "http://localhost:8080",
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  // Create first schedule record with cron expression to run every minute
  await prisma.schedule.create({
    data: {
      description: "First Schedule 1",
      ownerId: user.id,
      frequency: Frequency.Once,
      nextRun: new Date(),
      recurringRule: "* * * * *", // Cron expression to run every minute
      executorType: "shell",
      executorProperties: "echo 'Hello World 1'",
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  // Create second schedule record
  await prisma.schedule.create({
    data: {
      description: "Second Schedule 1",
      ownerId: user.id,
      frequency: Frequency.Recurring,
      nextRun: new Date(),
      recurringRule: "0 16 12 23 8 *",
      executorType: "http",
      executorProperties: "http://localhost:8080",
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  console.log("Seeding completed");
}

(async (): Promise<void> => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
