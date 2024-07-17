-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS no_update_delete_task_run_log ON "TaskRunLog";

-- Drop the function if it exists
DROP FUNCTION IF EXISTS prevent_task_run_log_update_delete;

-- Create the function to prevent updates and deletes on TaskRunLog
CREATE OR REPLACE FUNCTION prevent_task_run_log_update_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates and deletes are not allowed on TaskRunLog';
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to call the function before update or delete on TaskRunLog
CREATE TRIGGER no_update_delete_task_run_log
BEFORE UPDATE OR DELETE ON "TaskRunLog"
FOR EACH ROW EXECUTE FUNCTION prevent_task_run_log_update_delete();


-- Prisma created table instead of view, so we need to drop it and create a view
DROP TABLE IF EXISTS "ScheduleStatistics";

-- Drop the view if it exists
DROP VIEW IF EXISTS "ScheduleStatistics";

-- Create the view
CREATE VIEW "ScheduleStatistics" AS
SELECT
    "s"."id" AS "scheduleId",
    COUNT("tr"."id") AS "taskRunsCount",
    MAX(CASE WHEN "trl"."status" = 'Finished' THEN "trl"."createdAt" ELSE NULL END) AS "lastSuccess",
    MAX(CASE WHEN "trl"."status" = 'Failed' THEN "trl"."createdAt" ELSE NULL END) AS "lastError",
    COUNT(CASE WHEN "trl"."status" = 'InQueue' THEN 1 ELSE NULL END) AS "inQueueCount",
    COUNT(CASE WHEN "trl"."status" = 'Failed' THEN 1 ELSE NULL END) AS "errorCount",
    COUNT(CASE WHEN "trl"."status" = 'Finished' THEN 1 ELSE NULL END) AS "successCount",
    CASE
        WHEN "s"."enabled" = false THEN 'Disabled'
        WHEN "s"."nextRun" IS NOT NULL THEN CONCAT('Scheduled at ', to_char("s"."nextRun", 'Mon DD YYYY HH12:MIAM'))
        ELSE 'InQueue'
    END AS "currentStatus"
FROM
    "Schedule" "s"
LEFT JOIN
    "TaskRun" "tr" ON "s"."id" = "tr"."scheduleId"
LEFT JOIN
    "TaskRunLog" "trl" ON "tr"."id" = "trl"."taskRunId"
GROUP BY
    "s"."id";
