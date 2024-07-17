import { logger } from "./index";

export async function executeHttpTask(runProps: string) {
    logger.info("Executing HTTP task", runProps);
    // {
    //     "url": "https://google.com",
    //     "method": "GET",
    //     "headers": [
    //         { "Content-Type": "application/json" },
    //         { "Authorization": "Bearer: MY-AUTH-TOKEN" },
    //         { "X-Custom-Header": "Custom Value" }
    //     ],
    //     "body": "Hello World"
    // }
    try {
        const httpRequestProps = JSON.parse(runProps);

        const response = await fetch(httpRequestProps.url, {
            method: httpRequestProps.method,
            headers: httpRequestProps.headers,
            body: httpRequestProps.body,
        });
        if (!response.ok) {
            logger.error("Failed to execute HTTP task", response);
        }
        else {
            logger.info("HTTP task executed", response);
        }
    } catch (error) {
        logger.error("Failed to execute HTTP task", error);
    }
}
