import xPrisma from "@schedule-repo/db";
import type { ExtendedPrismaClient } from "@schedule-repo/db";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { getLogger } from "@schedule-repo/logger";

const logger = getLogger("user-service:prisma-plugin");

declare module "fastify" {
  interface FastifyInstance {
    xPrisma: ExtendedPrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  try {
    logger.info("Establish prisma connection");
    await xPrisma.$connect();
  } catch {
    logger.warn("Not connected to database");
  }
  server.decorate("xPrisma", xPrisma);
  server.addHook("onClose", async (server) => {
    logger.info("Shutting down prisma connection");
    await xPrisma.$disconnect();
  });
});

export default prismaPlugin;
