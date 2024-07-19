"use server";

import { redirect } from "next/navigation";
import { clientSchedule } from "@/tools/client-schedule-service";
import { getLogger } from "@schedule-repo/logger";
import { type Schedule, toScheduleMessage } from "@/types/schedule";
import { getSession } from "./authenticate";
import { revalidatePath } from "next/cache";

const logger = getLogger("ui-app:addSchedule");

export async function addSchedule(schedule: Schedule) {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/login");

  schedule.ownerId = session.user.id;

  try {
    logger.info("Adding schedule", { schedule });
    const message = toScheduleMessage(schedule);
    logger.info("Adding schedule", { schedule: message });
    const response = await clientSchedule.addSchedule(message);
  } catch (error) {
    logger.error("Failed to add schedule");
    logger.error(JSON.stringify(error));
    throw error;
  }
  revalidatePath("/dashboard/add-task");
  redirect("/dashboard");
}
