"use client";

import { EnabledButton } from "./enabled-disable-button";
import { DisabledButton } from "./disabled-enable-button";
import { DeleteButton } from "./delete-button";
import type { Schedule } from "@/types/schedule";
import { useState } from "react";
import crons from "cronstrue";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
export const ScheduleRow = ({
	schedule,
	index,
}: {
	schedule: Schedule;
	index: number;
}) => {
	const [item, setItem] = useState<Schedule>(schedule);
	const [deleted, setDeleted] = useState<boolean>(false);
	if (deleted) {
		return null;
	}
	return (
		<tr>
			<th>{index + 1}</th>
			<td>
				{item.enabled ? (
					<EnabledButton
						itemId={item.id}
						onChanged={() => {
							setItem({ ...item, enabled: false });
						}}
					/>
				) : (
					<DisabledButton
						itemId={item.id}
						onChanged={() => {
							setItem({ ...item, enabled: true });
						}}
					/>
				)}
			</td>
			<td>
				<div>{item.description}</div>
				{item.recurringRule && (
					<div className="font-extralight text-xs mt-2">
						{crons.toString(item.recurringRule)}
					</div>
				)}
			</td>
			<td suppressHydrationWarning>{item.nextRun?.toString()}</td>
			<td>{item.executorType}</td>
			<td>
				<a href={`/dashboard/schedule-task/${item.id}`}>
					<DesignServicesIcon
						titleAccess="Edit/Details"
						className="text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500"
					/>
				</a>
			</td>
			<td>
				<DeleteButton
					itemId={item.id}
					description={item.description}
					onDeleted={() => {
						setDeleted(true);
					}}
				/>
			</td>
		</tr>
	);
};
