import { ScheduleService } from "@schedule-repo/definitions/schedule";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

export const transport = createGrpcWebTransport({
    baseUrl: process.env.SCHEDULE_SERVICE_BASE_URL ?? "http://localhost:8081"
});

export const clientSchedule = createPromiseClient(ScheduleService, transport);