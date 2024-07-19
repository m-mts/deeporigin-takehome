"use server";
import { clientSchedule } from "@/tools/client-schedule-service";

export default async function enable(id: string) {
  await clientSchedule.enableSchedule({ id });
}
