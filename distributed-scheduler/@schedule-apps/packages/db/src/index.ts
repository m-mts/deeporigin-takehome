// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

export { Frequency, ExecutorType, Status } from "@prisma/client";

export * from "@prisma/client";

const prismaClientSingleton = () => {
  const prisma = new PrismaClient().$extends({
    model: {
      user: {
        async findByNameOrCreate(
          name: string
        ): Promise<{ id: string; name: string; isNewUser: boolean }> {
          const select = {
            id: true,
            name: true,
            enabled: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            updatedBy: true,
          };
          let user = await prisma.user.findUnique({
            where: { name },
            select,
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name,
                createdBy: "system",
                updatedBy: "system",
              },
              select
            });
            return { ...user, isNewUser: true };
          }

          return { ...user, isNewUser: false };
        },
      },
      taskRunLog: {
        update: undefined,
        delete: undefined,
        deleteMany: undefined,
        updateMany: undefined,
      },
    },
  });
  return prisma;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const xPrisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = xPrisma;

export default xPrisma;
export type ExtendedPrismaClient = PrismaClientSingleton;
