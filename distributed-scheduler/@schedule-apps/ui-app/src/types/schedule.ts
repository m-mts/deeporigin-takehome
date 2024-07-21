import {
  timestampToDate,
  dateToTimestamp,
} from "@/tools/timestamp-date-mappings";
import {
  type Schedule as gRPCSchedule,
  Frequency as gRPCFrequency,
  ExecutorType as gRPCExecutorType,
  type Statistics as gRPCStatistics,
  type TaskRun as gRPCTaskRun,
  Status as gRPCStatus,
} from "@schedule-repo/definitions";

export type Frequency = "Once" | "Recurring";

export type ExecutorType = "shell" | "http";

export type Status = "InQueue" | "Started" | "Finished" | "Failed";

export type Statistics = {
  taskRunsCount: number;
  lastSuccess?: Date;
  lastError?: Date;
  inQueueCount: number;
  errorCount: number;
  successCount: number;
  currentStatus: string;
}

export type TaskRun = {
  scheduleId: string;
  status: Status,
  runAt?: Date;
};

export type Schedule = Partial<{
  id: string;
  description: string;
  enabled: boolean;
  ownerId: string;
  frequency: Frequency;
  nextRun: Date;
  recurringRule: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  executorType: ExecutorType;
  executorProperties: string;
  statistics: Statistics;
  taskRuns: TaskRun[];
}>;

export function toSchedule(gRPCSchedule: gRPCSchedule): Schedule {
  return {
    id: gRPCSchedule.id,
    description: gRPCSchedule.description,
    enabled: gRPCSchedule.enabled,
    ownerId: gRPCSchedule.ownerId,
    frequency: toFrequency(gRPCSchedule.frequency),
    nextRun: timestampToDate(gRPCSchedule.nextRun),
    recurringRule: gRPCSchedule.recurringRule,
    createdAt: timestampToDate(gRPCSchedule.createdAt),
    updatedAt: timestampToDate(gRPCSchedule.updatedAt),
    createdBy: gRPCSchedule.createdBy,
    updatedBy: gRPCSchedule.updatedBy,
    executorType: toExecutorType(gRPCSchedule.executorType),
    executorProperties: gRPCSchedule.executorProperties,
    statistics: gRPCSchedule.statistics ? toStatistics(gRPCSchedule.statistics) : undefined,
    taskRuns: gRPCSchedule.taskRuns ? gRPCSchedule.taskRuns.map(toTaskRun) : undefined,
  };
}

export function toStatistics(gRPCStatistics: gRPCStatistics): Statistics {
  return {
    taskRunsCount: gRPCStatistics.taskRunsCount,
    lastSuccess: timestampToDate(gRPCStatistics.lastSuccess),
    lastError: timestampToDate(gRPCStatistics.lastError),
    inQueueCount: gRPCStatistics.inQueueCount,
    errorCount: gRPCStatistics.errorCount,
    successCount: gRPCStatistics.successCount,
    currentStatus: gRPCStatistics.currentStatus,
  };
}

export function toTaskRun(gRPCTaskRun: gRPCTaskRun): TaskRun {
  return {
    scheduleId: gRPCTaskRun.scheduleId,
    status: toStatus(gRPCTaskRun.status),
    runAt: timestampToDate(gRPCTaskRun.runAt),
  };
}

export function toScheduleMessage(schedule: Schedule): Partial<gRPCSchedule> {
  return {
    id: schedule.id,
    description: schedule.description,
    enabled: schedule.enabled,
    ownerId: schedule.ownerId,
    frequency: togRPCFrequency(schedule.frequency as Frequency),
    nextRun: dateToTimestamp(schedule.nextRun as Date),
    recurringRule: schedule.recurringRule,
    executorType: togRPCExecutorType(schedule.executorType as ExecutorType),
    executorProperties: schedule.executorProperties,
  };
}

export function toStatus(val: gRPCStatus): Status {
  const map = new Map<gRPCStatus, Status>([
    [ gRPCStatus.InQueue, "InQueue" ],
    [ gRPCStatus.Started, "Started" ],
    [ gRPCStatus.Finished, "Finished" ],
    [ gRPCStatus.Failed, "Failed" ],
  ]);
  if (!map.has(val)) {
    throw new Error(`Status "${val}" not found`);
  }

  return map.get(val) as Status;
}

export function toFrequency(val: gRPCFrequency): Frequency {
  const map = new Map<gRPCFrequency, Frequency>([
    [ gRPCFrequency.Once, "Once" ],
    [ gRPCFrequency.Recurring, "Recurring" ],
  ]);
  if (!map.has(val)) {
    throw new Error(`Frequency "${val}" not found`);
  }

  return map.get(val) as Frequency;
}

export function toExecutorType(val: gRPCExecutorType): ExecutorType {
  const map = new Map<gRPCExecutorType, ExecutorType>([
    [ gRPCExecutorType.shell, "shell" ],
    [ gRPCExecutorType.http, "http" ],
  ]);
  if (!map.has(val)) {
    throw new Error(`Executor type "${val}" not found`);
  }
  return map.get(val) as ExecutorType;
}

export function togRPCFrequency(val: Frequency): gRPCFrequency {
  const map = new Map<Frequency, gRPCFrequency>([
    [ "Once", gRPCFrequency.Once ],
    [ "Recurring", gRPCFrequency.Recurring ],
  ]);
  if (!map.has(val)) {
    throw new Error(`Frequency "${val}" not found`);
  }

  return map.get(val) as gRPCFrequency;
}

export function togRPCExecutorType(val: ExecutorType): gRPCExecutorType {
  const map = new Map<ExecutorType, gRPCExecutorType>([
    [ "shell", gRPCExecutorType.shell ],
    [ "http", gRPCExecutorType.http ],
  ]);
  if (!map.has(val)) {
    throw new Error(`Executor type "${val}" not found`);
  }
  return map.get(val) as gRPCExecutorType;
}
