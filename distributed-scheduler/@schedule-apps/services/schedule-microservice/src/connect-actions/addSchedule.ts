import type { Schedule, ScheduleRequest } from "@schedule-repo/definitions/schedule";
import { getServer } from "..";
import { frequencyMapper, executorTypeMapper } from "../mappers/toPrisma";
import { logger } from "../connect";
import { togRPCScheduleBase } from "mappers/togRPCSchedule";
import type { Schedule as DBSchedule } from "@schedule-repo/db";

export async function addSchedule(request: ScheduleRequest): Promise<{
	schedule: Schedule;
}> {
	logger.info("Create schedule");
	const server = await getServer();
	const data = {
		description: request.description,
		enabled: request.enabled,
		ownerId: request.ownerId,
		frequency: frequencyMapper(request.frequency),
		nextRun: request.nextRun ? request.nextRun.toDate() : null,
		recurringRule: request.recurringRule,
		executorType: executorTypeMapper(request.executorType),
		executorProperties: request.executorProperties,
		createdBy: request.ownerId,
		updatedBy: request.ownerId,
	}

	try {
		const createdSchedule = await server?.xPrisma.schedule.create({
			data,
		});
		return { schedule: togRPCScheduleBase(createdSchedule as DBSchedule) };
	}
	catch (error) {
		logger.error("Failed to create schedule", error);
		throw error;
	}
	finally {
		logger.info("Schedule created");
	}
}
