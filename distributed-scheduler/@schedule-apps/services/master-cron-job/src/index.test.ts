import { describe, expect, test, beforeEach, afterEach, spyOn, mock } from "bun:test";

import { clientSchedule } from "lib/client-schedule-service";
import type { ScheduleOperationStatusResponse } from "@schedule-repo/definitions";

import { main, retry } from "./index";
import type { Timestamp } from "@bufbuild/protobuf";

const dateToTimestampMock = mock();
mock.module("lib/timestamp-date-mappings", () => ({ dateToTimestamp: dateToTimestampMock }));

const retryMock = mock();
mock.module("./index", () => ({ main, retry: retryMock }));

describe("index", async () => {
    test("should plan execution successfully in 1st attempt", async () => {
        const runAt = new Date();
        const interval = process.env.PLAN_INTERVAL ? Number.parseInt(process.env.PLAN_INTERVAL) : 3;

        const ts = {
            seconds: 1234567890,
            nanos: 10000001,
        };
        dateToTimestampMock.mockReturnValue(ts);
        const clientSchedulePlanExecutionSpy = spyOn(clientSchedule, "planExecution");
        clientSchedulePlanExecutionSpy.mockImplementation(async (...args) => {
            console.log(args)
            return { success: true } as unknown as ScheduleOperationStatusResponse;
        })


        await main(runAt);

        expect(clientSchedulePlanExecutionSpy).toHaveBeenCalledWith({
            nextRunFrom: ts,
            nextRunTo: ts,
        })
    });

    test("should plan execution retry if got {success: false}", async () => {
        const runAt = new Date();
        const interval = process.env.PLAN_INTERVAL ? Number.parseInt(process.env.PLAN_INTERVAL) : 3;

        const clientSchedulePlanExecutionSpy = spyOn(clientSchedule, "planExecution");
        clientSchedulePlanExecutionSpy.mockImplementation(async (...args) => {
            return { success: false } as unknown as ScheduleOperationStatusResponse;
        })


        await main(runAt, 2);

        expect(retryMock).toHaveBeenCalledWith(runAt, 2);
    });

    test("should plan execution retry if error", async () => {
        const runAt = new Date();
        const interval = process.env.PLAN_INTERVAL ? Number.parseInt(process.env.PLAN_INTERVAL) : 3;

        const clientSchedulePlanExecutionSpy = spyOn(clientSchedule, "planExecution");
        clientSchedulePlanExecutionSpy.mockImplementation(async (...args) => {
            throw new Error("Some error");
        })


        await main(runAt, 3);

        expect(retryMock).toHaveBeenCalledWith(runAt, 3);
    });

});