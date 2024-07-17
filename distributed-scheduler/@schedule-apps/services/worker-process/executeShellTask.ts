import { logger } from "./index";

export async function executeShellTask(runProps: string) {
    try {
        const proc = Bun.spawn([ "sh", "-c", runProps ]);
        logger.info(`Execute: ${runProps}: `, await proc.exited);
    } catch (error) {
        logger.error("Failed to execute shell task", error);
    }
}
