import {
	EditScheduleTaskForm,
	type ScheduleForm,
} from "@/app/components/dashboard/schedule-task/edit";
import Dashboard from "../../components/dashboard/dashboard";

import { addMinutes } from "date-fns";

export default function AddScheduleTaskPage() {
	const task = {
		id: "",
		description: "new task",
		enabled: true,
		frequency: "Once",
		nextRun: addMinutes(new Date(), 10),
		recurringRule: "",
		executorType: "shell",
		executorProperties: "",
	} as ScheduleForm;
	return (
		<Dashboard>
			<EditScheduleTaskForm task={task} mode={"add"} />
		</Dashboard>
	);
}
