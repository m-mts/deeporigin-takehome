import type {
  Schedule,
  ScheduleRequest,
} from "@schedule-repo/definitions/schedule";
import type { Schedule as DBSchedule } from "@schedule-repo/db";
import { getServer } from "..";
import { frequencyMapper, executorTypeMapper } from "../mappers/toPrisma";
import { logger } from "../connect";
import { togRPCScheduleBase } from "mappers/togRPCSchedule";

export async function updateSchedule(request: ScheduleRequest) {
  logger.info("Update schedule");
  const server = await getServer();
  const data = {
    id: request.id,
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
  };

  console.log(data);
  try {
    const createdSchedule = await server?.xPrisma.schedule.update({
      where: { id: request.id },
      data,
    });
    return {
      schedule: togRPCScheduleBase(createdSchedule as DBSchedule)
    };
  } catch (error) {
    logger.error("Failed to Update schedule", error);
    throw error;
  } finally {
    logger.info("Updated schedule");
  }
}
