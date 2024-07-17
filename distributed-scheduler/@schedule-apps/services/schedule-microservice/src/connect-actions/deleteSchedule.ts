import type { ScheduleByIdRequest } from "@schedule-repo/definitions/schedule";
import { getServer } from "..";
import { logger } from "../connect";


export async function deleteSchedule(request: ScheduleByIdRequest) {
	logger.info("Delete schedule by id", request.id);
	const server = await getServer();
	const deletedSchedule = await server?.xPrisma.schedule.delete({
		where: {
			id: request.id,
		},
	});
	if (!deletedSchedule) {
		logger.error(`Schedule not found id: ${request.id}`);
		return { success: false };
	}
	logger.info("Schedule deleted", request.id);
	return { success: true };
}
