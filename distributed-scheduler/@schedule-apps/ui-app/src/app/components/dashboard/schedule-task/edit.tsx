"use client";

import type { Schedule } from "@/types/schedule";

import { use, useEffect, useState } from "react";
import { addMinutes, format, isPast } from "date-fns";
import crons from "cronstrue";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import validateJSON from "@/tools/json-executor-properties-validator";
import { addSchedule } from "@/app/actions/add-schedule";
import { editSchedule } from "@/app/actions/edit-schedule";

export type ScheduleForm = Required<
	Pick<
		Schedule,
		| "id"
		| "description"
		| "enabled"
		| "frequency"
		| "nextRun"
		| "recurringRule"
		| "executorType"
		| "executorProperties"
	>
>;

type HandleChangeCommonEvent = {
	target: { name: string; value: unknown; type: string; checked: boolean };
};

const jsonPlaceHolder = `{
	"url": "https://example.com",
	"method": "GET",
	"headers": [
		{ "Content-Type": "application/json" },
		{ "Authorization": "Bearer: MY-AUTH-TOKEN" },
		{ "X-Custom-Header": "Custom Value" }
	],
	"body": "Hello World"
}`;

export const EditScheduleTaskForm = ({
	task,
	mode,
}: {
	task: ScheduleForm;
	mode: "add" | "edit";
}) => {
	const [schedule, setSchedule] = useState<ScheduleForm>(task);

	useEffect(() => {
		setSchedule(task);
	}, [task]);

	const [cronsMessage, setCronsMessage] = useState<{
		text: string;
		type: "error" | "explanation";
	} | null>(null);

	const [jsonValidation, setJsonValidation] = useState<string | null>(null);

	const validateExecutorProperties = (e: { target: { value: string } }) => {
		const { value } = e.target;

		try {
			validateJSON(value);
			setJsonValidation(null);
		} catch (error) {
			setJsonValidation((error as Error).message);
		}
	};

	const handleChange = (e: HandleChangeCommonEvent) => {
		const { name, value, type, checked } = e.target;
		setSchedule((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (name === "recurringRule") {
			try {
				setCronsMessage({
					text: crons.toString(value as string),
					type: "explanation",
				});
			} catch (error) {
				setCronsMessage({ text: error as string, type: "error" });
			}
		}
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const scheduleToSend = structuredClone(schedule);
		scheduleToSend.nextRun = new Date(schedule.nextRun);
		console.log({ scheduleToSend });

		if (mode === "add") await addSchedule(scheduleToSend);
		if (mode === "edit") await editSchedule(scheduleToSend);
	};

	return (
		<div>
			<h1 className="text-3xl">
				{mode === "add" && "Add New Schedule Task"}
				{mode === "edit" && "Edit Schedule Task"}
			</h1>
			<div className="w-full pb-8 bg-base-100 dark:bg-neutral-800 flex justify-center items-start pt-10">
				<form
					onSubmit={handleSubmit}
					className="w-2/3 border border-gray-300 dark:border-neutral-700 shadow-xl rounded-lg p-6"
				>
					<div className="form-control mb-4">
						<label className="label">
							<span className="label-text text-gray-700 dark:text-gray-200">
								Description
							</span>
						</label>
						<textarea
							className="textarea textarea-bordered h-24 bg-base-100 dark:bg-neutral-600 text-gray-800 dark:text-white"
							name="description"
							value={schedule.description}
							onChange={(e) =>
								handleChange(e as unknown as HandleChangeCommonEvent)
							}
							placeholder="Enter description"
						/>
					</div>

					<div className="form-control mb-4">
						<label className="label cursor-pointer">
							<span className="label-text text-gray-700 dark:text-gray-200">
								Enabled
							</span>
							<div className="flex items-center">
								{schedule.enabled ? (
									<PublishedWithChangesIcon className="text-green-700" />
								) : (
									<UnpublishedIcon className="text-red-800" />
								)}
								<input
									type="checkbox"
									className="toggle toggle-primary ml-2"
									name="enabled"
									checked={schedule.enabled}
									onChange={handleChange}
								/>
							</div>
						</label>
					</div>

					<div className="form-control mb-4">
						<label className="label">
							<span className="label-text text-gray-700 dark:text-gray-200">
								Frequency
							</span>
						</label>
						<div className="flex space-x-4">
							<label className="label cursor-pointer">
								<input
									type="radio"
									name="frequency"
									value="Once"
									checked={schedule.frequency === "Once"}
									onChange={handleChange}
									className="radio radio-primary"
								/>
								<span className="label-text ml-2 text-gray-700 dark:text-gray-200">
									Once
								</span>
							</label>
							<label className="label cursor-pointer">
								<input
									type="radio"
									name="frequency"
									value="Recurring"
									checked={schedule.frequency === "Recurring"}
									onChange={handleChange}
									className="radio radio-primary"
								/>
								<span className="label-text ml-2 text-gray-700 dark:text-gray-200">
									Recurring
								</span>
							</label>
						</div>
					</div>

					<div className="form-control mb-4">
						<label className="label">
							<span className="label-text text-gray-700 dark:text-gray-200">
								{schedule.frequency === "Recurring" &&
									"Recurring Run Start Date"}
								{schedule.frequency === "Once" && "Scheduled Run Time"}
							</span>
						</label>
						<input
							type="datetime-local"
							className="input input-bordered bg-base-100 dark:bg-neutral-600 text-gray-800 dark:text-white"
							name="nextRun"
							value={format(
								schedule.nextRun ?? addMinutes(new Date(), 10),
								"yyyy-MM-dd'T'HH:mm",
							)}
							onChange={handleChange}
						/>
						{schedule.nextRun && isPast(schedule.nextRun) && (
							<p className="text-red-500 text-sm mt-1">
								Please select a future date and time.
							</p>
						)}
					</div>

					{schedule.frequency === "Recurring" && (
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text text-gray-700 dark:text-gray-200">
									Recurring Rule (Cron Expression)
								</span>
							</label>
							<input
								type="text"
								className="input input-bordered bg-base-100 dark:bg-neutral-600 text-gray-800 dark:text-white"
								name="recurringRule"
								value={schedule.recurringRule}
								onChange={handleChange}
								placeholder="e.g. 0 0 * * *"
							/>
							{cronsMessage?.type === "explanation" && (
								<p className="text-gray-700 dark:text-gray-300  text-sm mt-1">
									{cronsMessage.text}
								</p>
							)}
							{cronsMessage?.type === "error" && (
								<p className="text-red-500  text-sm mt-1">
									{cronsMessage.text}
								</p>
							)}
						</div>
					)}

					<div className="form-control mb-4">
						<label className="label">
							<span className="label-text text-gray-700 dark:text-gray-200">
								Executor Type
							</span>
						</label>
						<div className="flex space-x-4">
							<label className="label cursor-pointer">
								<input
									type="radio"
									name="executorType"
									value="shell"
									checked={schedule.executorType === "shell"}
									onChange={handleChange}
									className="radio radio-primary"
								/>
								<span className="label-text ml-2 text-gray-700 dark:text-gray-200">
									Shell
								</span>
							</label>
							<label className="label cursor-pointer">
								<input
									type="radio"
									name="executorType"
									value="http"
									checked={schedule.executorType === "http"}
									onChange={handleChange}
									className="radio radio-primary"
								/>
								<span className="label-text ml-2 text-gray-700 dark:text-gray-200">
									HTTP
								</span>
							</label>
						</div>
					</div>

					<div className="form-control mb-4">
						<label className="label">
							<span className="label-text text-gray-700 dark:text-gray-200">
								{schedule.executorType === "shell"
									? "Command"
									: "HTTP Properties"}
							</span>
						</label>
						{schedule.executorType === "shell" ? (
							<input
								type="text"
								className="input input-bordered bg-base-100 dark:bg-neutral-600 text-gray-800 dark:text-white"
								name="executorProperties"
								value={schedule.executorProperties}
								onChange={handleChange}
								placeholder="echo 'hello'"
							/>
						) : (
							<textarea
								className="textarea textarea-bordered h-72 bg-base-100 dark:bg-neutral-600 text-gray-800 dark:text-white"
								name="executorProperties"
								value={schedule.executorProperties}
								onChange={(e) =>
									setSchedule((prev) => ({
										...prev,
										executorProperties: e.target.value,
									}))
								}
								onBlur={validateExecutorProperties}
								placeholder={jsonPlaceHolder}
							/>
						)}
						{jsonValidation && (
							<>
								<p className="text-red-500 text-sm mt-1">{jsonValidation}</p>
								<p className="text-gray-700 dark:text-gray-300  text-sm mt-1">
									Example:
									<code>
										<pre>{jsonPlaceHolder}</pre>
									</code>
								</p>
							</>
						)}
					</div>

					<div className="form-control mt-6">
						<button
							className="btn btn-primary"
							type="submit"
							disabled={
								!!jsonValidation ||
								(schedule.nextRun && isPast(schedule.nextRun)) ||
								cronsMessage?.type === "error"
							}
						>
							{mode === "add" && "Add Schedule Task"}
							{mode === "edit" && "Save Schedule Task"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
