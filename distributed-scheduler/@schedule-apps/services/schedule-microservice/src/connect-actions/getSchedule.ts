import type { Schedule, ScheduleByIdRequest } from "@schedule-repo/definitions/schedule";
import { getServer } from "..";
import { logger } from "../connect";
import { togRPCSchedule } from "mappers/togRPCSchedule";
import type { Schedule as DBSchedule } from "@schedule-repo/db";

export async function getSchedule(request: ScheduleByIdRequest) {
	logger.info("Get schedule by id", request.id);
	const server = await getServer();
	const scheduleRecord = await server?.xPrisma.schedule.findUnique({
		where: {
			id: request.id,
		},
		include: {
			statistics: true,
			taskRuns: true
		},
	});
	if (!scheduleRecord) {
		throw new Error(`Schedule not found id: ${request.id}`);
	}
	const result = { schedule: togRPCSchedule(scheduleRecord) };
	logger.info("schedule record found", result);
	return result;
}
