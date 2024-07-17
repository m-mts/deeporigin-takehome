import type { GetScheduleListRequest, Schedule } from "@schedule-repo/definitions/schedule";
import { getServer } from "..";
import { logger } from "../connect";
import { togRPCScheduleBase } from "mappers/togRPCSchedule";

export async function getScheduleBy(request: GetScheduleListRequest) {
	logger.info("Get schedule list", request);
	const server = await getServer();
	const scheduleList = await server?.xPrisma.schedule.findMany({
		where: {
			...(request.enabled === undefined ? {} : { enabled: request.enabled }),
			...(request.ownerId === undefined ? {} : { ownerId: request.ownerId }),
		},
	});
	logger.info("Schedule list retrieved", scheduleList);

	const schedule = scheduleList?.map<Schedule>(togRPCScheduleBase);

	const data = { schedule };

	console.log(data);

	return data;
}
