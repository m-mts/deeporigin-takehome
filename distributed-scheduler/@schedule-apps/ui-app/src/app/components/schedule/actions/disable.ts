"use server";
import { clientSchedule } from "@/tools/client-schedule-service";

export default async function disable(id: string) {
  await clientSchedule.disableSchedule({ id });
}
