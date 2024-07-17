import type { ScheduleByIdRequest } from "@schedule-repo/definitions/schedule";
import { getServer } from "..";
import { logger } from "../connect";


export async function disableSchedule(request: ScheduleByIdRequest) {
	logger.info("Disable schedule by id", request.id);
	const server = await getServer();
	const disabledSchedule = await server?.xPrisma.schedule.update({
		where: {
			id: request.id,
		},
		data: {
			enabled: false,
		},
	});
	if (!disabledSchedule) {
		logger.error(`Schedule not found id: ${request.id}`);
		return { success: false };
	}
	logger.info("Schedule disabled", request.id);
	return { success: true };
}
