import type { PlanExecutionRequest } from "@schedule-repo/definitions/schedule";
import { logger } from "../connect";
import { timestampToDate } from "../mappers/timestampToDate";
import { getServer, type UserAppServer } from "..";
import {
  Frequency,
  Status,
  type Schedule,
  type TaskRun,
} from "@schedule-repo/db";
import { Queue } from 'bullmq';
import { type ParserOptions, parseExpression } from "cron-parser";

type QueueJobData = {
  description: string,
  runAt: Date,
  taskRunId: string,
  ownerId: string,
};

export async function planExecution(request: PlanExecutionRequest) {
  const start = timestampToDate(request.nextRunFrom);
  const end = timestampToDate(request.nextRunTo);
  logger.info("Plan execution", { request, start, end });
  if (!start || !end || start >= end) {
    logger.error("Invalid time range");
    return { success: false };
  }

  try {
    const server = await getServer();
    const tasks = (await server?.xPrisma.schedule.findMany({
      where: {
        enabled: true,
        nextRun: {
          gte: start,
          lt: end,
        },
      },
    })) as Schedule[];

    const queue = new Queue<QueueJobData>("queue", {
      prefix: `{${process.env.QUEUE_NAME ?? 'scheduler-tasks-queue'}}`,
      connection: {
        host: process.env.QUEUE_HOST ?? 'localhost',
        port: Number.parseInt(process.env.QUEUE_PORT ?? '6379'),
      }
    });
    logger.info("Found tasks: ", tasks.length);
    tasks?.map(async (task) => {
      if (task.frequency === Frequency.Once) await planOnce(task, queue);
      if (task.frequency === Frequency.Recurring) await planRecurring(task, end, queue, server as UserAppServer);
    });
  }
  catch (error) {
    logger.error("Failed to plan execution", error);
    return { success: false };
  }

  logger.info("Execution planned");
  return { success: true };
}

async function planOnce(task: Schedule, queue: Queue<QueueJobData>) {
  if (task.nextRun) await createTaskRun(task, task.nextRun, queue);
}

async function planRecurring(task: Schedule, end: Date, queue: Queue<QueueJobData>, server: UserAppServer) {
  if (task.nextRun && task.recurringRule) {
    const options = {
      currentDate: task.nextRun,
      endDate: end,
      iterator: true,
    } as ParserOptions<true>;
    const interval = parseExpression<true>(task.recurringRule, options);

    let nextDate = task.nextRun;
    await createTaskRun(task, nextDate, queue);
    for (let next = interval.next(); !next.done; next = interval.next()) {
      nextDate = next.value.toDate();
      await createTaskRun(task, nextDate, queue);
    }

    const nextPlannedRun = parseExpression<false>(task.recurringRule, {
      currentDate: nextDate,
      iterator: false,
    });

    await server?.xPrisma.schedule.update({
      where: { id: task.id },
      data: { nextRun: nextPlannedRun.next().toDate(), updatedAt: new Date() },
    });

  }
}

async function createTaskRun(task: Schedule, runAt: Date, queue: Queue<QueueJobData>) {
  let taskRun = null;
  try {
    const server = await getServer();
    taskRun = (await server?.xPrisma.taskRun.create({
      data: {
        scheduleId: task.id,
        status: Status.InQueue,
        runAt: runAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: task.ownerId,
        updatedBy: task.ownerId,
        log: {
          create: [
            {
              status: Status.InQueue,
              createdAt: new Date(),
              runAt: runAt,
            },
          ],
        },
      },
    })) as TaskRun;

    await queue.add(taskRun.id,
      { description: task.description, runAt, taskRunId: taskRun.id, ownerId: task.ownerId } as QueueJobData,
      {
        delay: Number(runAt) - Number(new Date()),
        //Deduplication
        jobId: `${taskRun.id}-${runAt.getTime()}`
      }
    );
    logger.info("Task run created", taskRun);
    return taskRun;
  } catch (error) {
    logger.error("Failed to create task run", error, task, runAt);
    if (taskRun) {
      const server = await getServer();
      await server?.xPrisma.taskRunLog.create({
        data: {
          taskRunId: taskRun.id,
          status: Status.Failed,
          createdAt: new Date(),
          runAt: runAt,
        }
      })
    }
  }
}
