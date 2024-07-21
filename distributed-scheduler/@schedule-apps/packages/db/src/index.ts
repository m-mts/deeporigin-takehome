// lib/prisma.ts

import { type Prisma, PrismaClient } from "@prisma/client";

export { Frequency, ExecutorType, Status } from "@prisma/client";

export * from "@prisma/client";

export const ExtendedPrismaClient = (props: Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions> | undefined) => {
  const prisma = new PrismaClient(props).$extends({
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

export type ExtendedPrismaClientType = ReturnType<typeof ExtendedPrismaClient>;