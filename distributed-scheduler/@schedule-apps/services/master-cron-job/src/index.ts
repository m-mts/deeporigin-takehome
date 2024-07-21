import { clientSchedule } from "lib/client-schedule-service";
import { dateToTimestamp } from "lib/timestamp-date-mappings";
import { getLogger } from "../../../packages/logger/dist";
import type { Timestamp } from "@bufbuild/protobuf";
const logger = getLogger("master-cron-job");

import storage from 'node-persist';

export async function main(runAt: Date | undefined = undefined, attempt = 1): Promise<void> {
  const startFromTs = await storage.getItem('START_FROM_TS') ?? new Date().getTime();
  const currentRun = runAt ?? new Date(startFromTs - 2500);
  const interval = Number.parseInt(process.env.RUN_INTERVAL ?? '5');
  const currentRunTill = new Date(Math.max(currentRun.getTime() + interval * 60000, new Date().getTime()) + 2000);
  logger.info("Master planner started at", currentRun, currentRunTill);

  let result = null;
  let isError = false;
  try {
    // Plan execution for the next interval
    // to achieve performance at-scale, 
    // we have to divide interval into multiple parts
    // and call planning service (in k8s we can have multiple replicas) in parallel
    result = await clientSchedule.planExecution({
      nextRunFrom: dateToTimestamp(currentRun) as unknown as Timestamp,
      nextRunTo: dateToTimestamp(currentRunTill) as unknown as Timestamp,
    });
  } catch (error) {
    logger.error("Failed to plan execution", error);
    isError = true;
  }

  if (!isError && result?.success) {
    logger.info("Execution planned successfully");
    await storage.setItem('START_FROM_TS', currentRunTill.getTime() - 2000);
  } else {
    logger.error("Planner failed to plan execution");
    await retry(runAt, attempt);
  }
}

export async function retry(runAt: Date | undefined, attempt: number): Promise<void> {
  if (attempt < Number.parseInt(process.env.MAX_ATTEMPTS ?? '3')) {
    logger.info(`Retrying in ${5 * attempt} seconds`);
    await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
    await main(runAt, attempt + 1);
  }
  else {
    logger.fatal("ERRORS! Max attempts reached.");
  }
}

(async () => {
  let exitCode = 0;
  try {
    await storage.init({ logging: true });
    await main();
  } catch (error) {
    logger.error(error);
    exitCode = 1;
  } finally {
    logger.info("Finished!");
    process.exit(exitCode);
  }
})();
