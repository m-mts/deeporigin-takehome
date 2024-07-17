import { dateToTimestamp } from "./dateToTimestamp";
import { executorTypeMapper, frequencyMapper, statusTypeMapper } from "./toProto";
import type { TaskRun, Schedule, Statistics } from "@schedule-repo/definitions/schedule";
import type { Schedule as DBSchedule, ScheduleStatistics as DBScheduleStatistics, TaskRun as DBTaskRun } from "@schedule-repo/db";

export const togRPCScheduleStatistics = (it: DBScheduleStatistics): Statistics => ({
    taskRunsCount: it.taskRunsCount,
    lastSuccess: dateToTimestamp(it.lastSuccess),
    lastError: dateToTimestamp(it.lastError),
    inQueueCount: it.inQueueCount,
    errorCount: it.errorCount,
    successCount: it.successCount,
    currentStatus: it.currentStatus
} as unknown as Statistics);

export const togRPCScheduleTaskRun = (it: DBTaskRun): TaskRun => ({
    scheduleId: it.scheduleId,
    status: statusTypeMapper(it.status),
    runAt: dateToTimestamp(it.runAt)
} as TaskRun);

export const togRPCScheduleBase = (it: DBSchedule): Schedule => ({
    id: it.id,
    description: it.description,
    enabled: it.enabled,
    ownerId: it.ownerId,
    frequency: frequencyMapper(it.frequency),
    nextRun: dateToTimestamp(it.nextRun),
    recurringRule: it.recurringRule as unknown as string,
    executorType: executorTypeMapper(it.executorType),
    executorProperties: it.executorProperties as unknown as string,
    createdBy: it.createdBy,
    updatedBy: it.updatedBy,
    createdAt: dateToTimestamp(it.createdAt),
    updatedAt: dateToTimestamp(it.updatedAt),
} as Schedule);

export const togRPCSchedule = (it: DBSchedule & { statistics: DBScheduleStatistics[] | undefined, taskRuns: DBTaskRun[] | undefined }): Schedule => ({
    ...togRPCScheduleBase(it),
    statistics: it.statistics?.[ 0 ] ? togRPCScheduleStatistics(it.statistics?.[ 0 ]) : undefined,
    taskRuns: it.taskRuns?.map(togRPCScheduleTaskRun),
} as Schedule);

