import type { ScheduleByIdRequest } from "@schedule-repo/definitions/schedule";
import { getServer } from "..";
import { logger } from "../connect";


export async function enableSchedule(request: ScheduleByIdRequest) {
	logger.info("Enable schedule by id", request.id);
	const server = await getServer();
	const enabledSchedule = await server?.xPrisma.schedule.update({
		where: {
			id: request.id,
		},
		data: {
			enabled: true,
		},
	});
	if (!enabledSchedule) {
		logger.error(`Schedule not found id: ${request.id}`);
		return { success: false };
	}
	logger.info("Schedule enabled", request.id);
	return { success: true };
}
