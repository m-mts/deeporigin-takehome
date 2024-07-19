import { clientSchedule } from "lib/client-schedule-service";
import { dateToTimestamp } from "lib/timestamp-date-mappings";
import { getLogger } from "../../../packages/logger/dist";
import type { Timestamp } from "@bufbuild/protobuf";
const logger = getLogger("master-cron-job");

export async function main(runAt: Date | undefined = undefined, attempt = 1): Promise<void> {
  const currentRun = runAt ?? new Date();

  const interval = Number.parseInt(process.env.RUN_INTERVAL ?? '5');
  console.log(clientSchedule)
  logger.info("Master planner started at", currentRun);

  let result = null;
  let isError = false;
  try {
    // Plan execution for the next interval
    // to achieve performance at-scale, 
    // we have to divide interval into multiple parts
    // and call planning service (in k8s we can have multiple replicas) in parallel
    result = await clientSchedule.planExecution({
      nextRunFrom: dateToTimestamp(currentRun) as unknown as Timestamp,
      nextRunTo: dateToTimestamp(new Date(currentRun.getTime() + interval * 60000)) as unknown as Timestamp,
    });
  } catch (error) {
    logger.error("Failed to plan execution", error);
    isError = true;
  }

  if (!isError && result?.success) {
    logger.info("Execution planned successfully");
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
    await main();
  } catch (error) {
    logger.error(error);
    exitCode = 1;
  } finally {
    logger.info("Finished!");
    process.exit(exitCode);
  }
})();
