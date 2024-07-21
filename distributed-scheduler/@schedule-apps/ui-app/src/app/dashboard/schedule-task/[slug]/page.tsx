import {
	EditScheduleTaskForm,
	type ScheduleForm,
} from "@/app/components/dashboard/schedule-task/edit";
import StatisticsView from "@/app/components/dashboard/schedule-task/statistics";
import Dashboard from "@/app/components/dashboard/dashboard";
import type { Schedule as gRPCSchedule } from "@schedule-repo/definitions";
import { clientSchedule } from "@/tools/client-schedule-service";
import { toSchedule, type Statistics, type TaskRun } from "@/types/schedule";
import TaskRunView from "@/app/components/dashboard/schedule-task/task-runs";

export default async function EditScheduleTaskPage({
	params,
}: { params: { slug: string } }) {
	const response = await clientSchedule.getSchedule({
		id: params.slug,
	});

	const task = toSchedule(
		response.schedule as unknown as gRPCSchedule,
	) as ScheduleForm & { statistics: Statistics; taskRuns: TaskRun[] };

	return (
		<Dashboard data-testid="dashboard">
			<StatisticsView
				statistics={task.statistics}
				data-testid="statistics-view"
			/>
			<EditScheduleTaskForm
				task={task}
				mode="edit"
				data-testid="edit-schedule-task-form"
			/>
			<TaskRunView taskRuns={task.taskRuns} data-testid="task-run-view" />
		</Dashboard>
	);
}
