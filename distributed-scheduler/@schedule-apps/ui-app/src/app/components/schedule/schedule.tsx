import { clientSchedule } from "@/tools/client-schedule-service";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { EnabledButton } from "./enabled-disable-button";
import { DisabledButton } from "./disabled-enable-button";
import { ScheduleRow } from "./schedule-row";
import { toSchedule } from "@/types/schedule";
import { getSession } from "@/app/actions/authenticate";
import { redirect } from "next/navigation";

export const Schedule = async () => {
	const session = await getSession();
	if (!session.isLoggedIn) redirect("/login");

	const scheduleResponse = await clientSchedule.getScheduleBy({
		ownerId: session.user.id,
	});

	const schedule = scheduleResponse.schedule.map((item) => toSchedule(item));

	return (
		<div>
			<h1 className="text-3xl">Schedule </h1>
			<div className="overflow-x-auto  bg-base-100">
				<table className="table table-zebra">
					<thead className="bg-base-200 text-base">
						<tr>
							<th>#</th>
							<th> Enabled </th>
							<th> Description </th>
							<th> Next Run </th>
							<th> Execution On</th>
							<th colSpan={2}> &nbsp; </th>
						</tr>
					</thead>
					<tbody>
						{schedule.map((item, index) => (
							<ScheduleRow
								key={`ScheduleRow-${item.id}`}
								schedule={item}
								index={index}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
