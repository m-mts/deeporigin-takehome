
import { describe, expect, test, vi } from "vitest";
import { type Schedule, toSchedule, toStatistics, toTaskRun, toStatus, toFrequency, toExecutorType, togRPCFrequency, togRPCExecutorType } from "../schedule";
import {
    type Schedule as gRPCSchedule,
    Frequency as gRPCFrequency,
    ExecutorType as gRPCExecutorType,
    type Statistics as gRPCStatistics,
    type TaskRun as gRPCTaskRun,
    Status as gRPCStatus,
} from "@schedule-repo/definitions";

import type { Timestamp } from "@bufbuild/protobuf";

vi.mock("@/tools/timestamp-date-mappings", () => ({
    timestampToDate: () => new Date(),
    dateToTimestamp: () => ({ seconds: 0, nanos: 0 }),
}));

describe("Schedule mappings", () => {
    test("toSchedule converts gRPCSchedule to Schedule", () => {
        const gRPCSchedule = {
            id: "123",
            description: "Test schedule",
            enabled: true,
            ownerId: "456",
            frequency: 0,
            nextRun: { seconds: 0, nanos: 0 } as unknown as Timestamp,
            recurringRule: "",
            createdAt: { seconds: 0, nanos: 0 } as unknown as Timestamp,
            updatedAt: { seconds: 0, nanos: 0 } as unknown as Timestamp,
            createdBy: "789",
            updatedBy: "789",
            executorType: 0,
            executorProperties: "echo 'hello world'",
            statistics: {
                taskRunsCount: 5,
                lastSuccess: { seconds: 0, nanos: 0 } as unknown as Timestamp,
                lastError: { seconds: 0, nanos: 0 } as unknown as Timestamp,
                inQueueCount: 2,
                errorCount: 1,
                successCount: 3,
                currentStatus: "Finished",
            },
            taskRuns: [
                {
                    scheduleId: "123",
                    status: 2,
                    runAt: { seconds: 0, nanos: 0 } as unknown as Timestamp,
                },
            ],
        } as Partial<gRPCSchedule>;

        const expectedSchedule: Schedule = {
            id: "123",
            description: "Test schedule",
            enabled: true,
            ownerId: "456",
            frequency: "Once",
            nextRun: expect.any(Date),
            recurringRule: "",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            createdBy: "789",
            updatedBy: "789",
            executorType: "shell",
            executorProperties: "echo 'hello world'",
            statistics: {
                taskRunsCount: 5,
                lastSuccess: expect.any(Date),
                lastError: expect.any(Date),
                inQueueCount: 2,
                errorCount: 1,
                successCount: 3,
                currentStatus: "Finished",
            },
            taskRuns: [
                {
                    scheduleId: "123",
                    status: "Finished",
                    runAt: expect.any(Date),
                },
            ],
        };

        const result = toSchedule(gRPCSchedule as gRPCSchedule);

        expect(result).toEqual(expectedSchedule);
    });

    test("toStatistics converts gRPCStatistics to Statistics", () => {
        const gRPCStatistics = {
            taskRunsCount: 5,
            lastSuccess: { seconds: 0, nanos: 0 } as unknown as Timestamp,
            lastError: { seconds: 0, nanos: 0 } as unknown as Timestamp,
            inQueueCount: 2,
            errorCount: 1,
            successCount: 3,
            currentStatus: "Finished",
        } as gRPCStatistics;

        const expectedStatistics = {
            taskRunsCount: 5,
            lastSuccess: expect.any(Date),
            lastError: expect.any(Date),
            inQueueCount: 2,
            errorCount: 1,
            successCount: 3,
            currentStatus: "Finished",
        };

        const result = toStatistics(gRPCStatistics);

        expect(result).toEqual(expectedStatistics);
    });

    test("toTaskRun converts gRPCTaskRun to TaskRun", () => {
        const gRPCTaskRun =
            {
                scheduleId: "123",
                status: 2,
                runAt: { seconds: 0, nanos: 0 } as unknown as Timestamp,
            } as gRPCTaskRun;

        const expectedTaskRun = {
            scheduleId: "123",
            status: "Finished",
            runAt: expect.any(Date),
        };

        const result = toTaskRun(gRPCTaskRun);

        expect(result).toEqual(expectedTaskRun);
    });

    test("toStatus converts gRPCStatus to Status", () => {
        expect(toStatus(0)).toEqual('InQueue');
        expect(toStatus(1)).toEqual('Started');
        expect(toStatus(2)).toEqual('Finished');
        expect(toStatus(3)).toEqual('Failed');
    });

    test("toFrequency converts gRPCFrequency to Frequency", () => {
        expect(toFrequency(0)).toEqual('Once');
        expect(toFrequency(1)).toEqual('Recurring');
    });

    test("toExecutorType converts gRPCExecutorType to ExecutorType", () => {
        expect(toExecutorType(0)).toEqual('shell');
        expect(toExecutorType(1)).toEqual('http');
    });

    test("togRPCFrequency converts Frequency to gRPCFrequency", () => {
        expect(togRPCFrequency('Once')).toEqual(0);
        expect(togRPCFrequency('Recurring')).toEqual(1);
    });

    test("togRPCExecutorType converts ExecutorType to gRPCExecutorType", () => {
        expect(togRPCExecutorType('shell')).toEqual(0);
        expect(togRPCExecutorType('http')).toEqual(1);
    });
});