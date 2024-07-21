import { ExtendedPrismaClient } from "@schedule-repo/db";
import type { ExtendedPrismaClientType } from "@schedule-repo/db";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { getLogger } from "../../../../packages/logger/dist";

const logger = getLogger("schedule-service:prisma-plugin");

declare module "fastify" {
	interface FastifyInstance {
		xPrisma: ExtendedPrismaClientType;
	}
}
const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
	logger.info("Connecting to prisma", process.env.DATABASE_URL);
	const xPrisma = ExtendedPrismaClient({
		datasourceUrl: process.env.DATABASE_URL,
		log: [ 'query', 'info', 'warn', 'error' ],
	});

	server.decorate("xPrisma", xPrisma);
	server.addHook("onClose", async (server) => {
		logger.info("Shutting down prisma connection");
		await xPrisma.$disconnect();
	});
});
export default prismaPlugin;
