import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

import { type Job, Worker } from "bullmq";
import { getLogger } from "@schedule-repo/logger";
import { ExtendedPrismaClient } from "@schedule-repo/db";
import {
    Status,
} from "@schedule-repo/db";
import { executeTask } from "./executeTask";

export type QueueJobData = {
    description: string;
    runAt: Date;
    taskRunId: string;
};

export const logger = getLogger("job-worker");

const xPrisma = ExtendedPrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: [ "query", "info", "warn", "error" ],
});

const proceedJob = async (job: Job<QueueJobData>) => {
    logger.info("Job started :::", { job: job.data });
    try {
        await xPrisma.taskRun.update({
            where: {
                id: job.data.taskRunId,
            },
            data: {
                status: Status.Started,
                updatedAt: new Date(),
                log: {
                    create: [
                        {
                            status: Status.Started,
                            createdAt: new Date(),
                            runAt: job.data.runAt,
                        },
                    ],
                },
            },
        });
    }
    catch (error) {
        logger.error("Failed to update taskRun to Started", error);
    }
    executeTask(xPrisma, job.data);
};

async function createWorker(): Promise<Worker<QueueJobData>> {
    try {
        await xPrisma.$connect();
        const worker = new Worker<QueueJobData>(
            "queue",
            proceedJob,
            {
                prefix: `{${process.env.QUEUE_NAME ?? 'scheduler-tasks-queue'}}`,
                connection: {
                    host: process.env.QUEUE_HOST ?? "localhost",
                    port: Number.parseInt(process.env.QUEUE_PORT ?? "6379"),
                },
            }
        );
        return worker;
    } catch (error) {
        logger.error("Failed to create worker", error);
        await xPrisma.$disconnect();
        throw error;
    }
}

process.on("exit", async () => {
    await xPrisma.$disconnect();
});

async function _run(): Promise<Worker<QueueJobData> | null> {
    try {
        return await createWorker();
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
    return null;
}

export const worker = await _run();
worker?.on("completed", async (job) => {
    logger.info("Job completed with result", { job: job?.data });
    try {
        await xPrisma.taskRun.update({
            where: {
                id: job.data.taskRunId,
            },
            data: {
                status: Status.Finished,
                updatedAt: new Date(),
                log: {
                    create: [
                        {
                            status: Status.Finished,
                            createdAt: new Date(),
                            runAt: job.data.runAt,
                        },
                    ],
                },
            },
        });
    } catch (error) {
        logger.error("Failed to update taskRun to Completed", error);
    }
});

worker?.on("failed", async (job, err) => {
    logger.error("Job failed", { err, job: job?.data });
    try {
        await xPrisma.taskRun.update({
            where: {
                id: job?.data.taskRunId,
            },
            data: {
                status: Status.Failed,
                updatedAt: new Date(),
                log: {
                    create: [
                        {
                            status: Status.Failed,
                            createdAt: new Date(),
                            runAt: job?.data.runAt ?? new Date(),
                        },
                    ],
                },
            },
        });
    } catch (error) {
        logger.error("Failed to update taskRun to Failed", error);
    }
});

worker?.on("error", err => {
    logger.error("Job ERROR");
});