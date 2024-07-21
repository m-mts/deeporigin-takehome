import { logger, type QueueJobData } from "./index";
import type { ExtendedPrismaClientType } from "@schedule-repo/db";
import { executeShellTask } from "./executeShellTask";
import { executeHttpTask } from "./executeHttpTask";


const executor: { [ key: string ]: (runProps: string) => Promise<void> } = {};
executor.http = executeHttpTask;
executor.shell = executeShellTask;

export async function executeTask(xPrisma: ExtendedPrismaClientType, job: QueueJobData) {
    logger.info("Executing task", job);
    const run = await xPrisma.taskRun.findUnique({
        where: {
            id: job.taskRunId,
        },
        include: {
            schedule: true,
        },
    });
    if (!run?.schedule) {
        logger.error("Task run not found", job.taskRunId);
        return;
    }

    await executor[ run.schedule.executorType ](run.schedule.executorProperties as string);
}

