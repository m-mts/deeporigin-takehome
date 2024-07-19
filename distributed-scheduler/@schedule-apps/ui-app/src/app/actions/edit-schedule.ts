"use server";

import { redirect } from "next/navigation";
import { clientSchedule } from "@/tools/client-schedule-service";
import { getLogger } from "@schedule-repo/logger";
import { type Schedule, toScheduleMessage } from "@/types/schedule";
import { getSession } from "./authenticate";
import { revalidatePath } from "next/cache";

const logger = getLogger("ui-app:addSchedule");

export async function editSchedule(schedule: Schedule) {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/login");

  schedule.updatedBy = session.user.id;

  try {
    const message = toScheduleMessage(schedule);
    console.log(message);
    const response = await clientSchedule.updateSchedule(message);
  } catch (error) {
    logger.error("Failed to update schedule");
    logger.error(JSON.stringify(error));
    throw error;
  }
  revalidatePath(`/dashboard/schedule-task/${schedule.id}`);
  redirect("/dashboard");
}
