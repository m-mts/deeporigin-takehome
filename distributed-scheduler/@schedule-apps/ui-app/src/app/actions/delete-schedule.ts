"use server";
import { clientSchedule } from "@/tools/client-schedule-service";

export default async function deleteTask(id: string) {
  await clientSchedule.deleteSchedule({ id });
}
