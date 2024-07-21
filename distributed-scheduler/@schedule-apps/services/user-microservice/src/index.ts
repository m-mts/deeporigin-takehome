import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import type { ExtendedPrismaClientType } from "@schedule-repo/db";
import { fastify } from "fastify";
import { getLogger } from "@schedule-repo/logger";
import routes from "./connect";
import prismaPlugin from "./plugin/prisma";



const logger = getLogger("user-service:index");

export type UserAppServer = {
	// biome-ignore lint/suspicious/noExplicitAny: need to be any for testing purposes
	register: (...args: any) => void;
	// biome-ignore lint/suspicious/noExplicitAny: need to be any for testing purposes
	listen: (...args: any) => void;
	xPrisma: ExtendedPrismaClientType;
};

export async function configure<T extends UserAppServer>(
	server: T,
): Promise<T> {
	server.register(prismaPlugin);
	server.register(fastifyConnectPlugin, {
		routes,
	});

	const host = process.env.HOST ?? "localhost";
	const port = Number.parseInt(process.env.PORT ?? "8080");

	logger.info("Starting user service", { host, port, db: process.env.DATABASE_URL });

	await server.listen({
		host,
		port,
	});

	return server;
}

async function _run(): Promise<UserAppServer | null> {
	try {
		return await configure(fastify());
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}

	return null;
}

export const server = await _run();

export async function getServer() {
	return await server;
}
