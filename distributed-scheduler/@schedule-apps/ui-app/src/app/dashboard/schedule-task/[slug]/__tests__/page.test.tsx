import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EditScheduleTaskPage from "../page";

vi.mock("@/app/components/dashboard/dashboard", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	default: (props: any) => <div {...props}>{props.children}</div>,
}));

const mockStatisticsView = vi.hoisted(() => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	default: (props: any) => <div {...props} />,
}));
vi.mock(
	"@/app/components/dashboard/schedule-task/statistics",
	() => mockStatisticsView,
);
const mockTaskRunView = vi.hoisted(() => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	default: (props: any) => <div {...props} />,
}));
vi.mock(
	"@/app/components/dashboard/schedule-task/task-runs",
	() => mockTaskRunView,
);

const mockEditScheduleTaskForm = vi.hoisted(() => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	EditScheduleTaskForm: (props: any) => <div {...props} />,
}));
vi.mock(
	"@/app/components/dashboard/schedule-task/edit",
	() => mockEditScheduleTaskForm,
);

const mockClientScheduleService = vi.hoisted(() => ({
	clientSchedule: {
		getSchedule: vi.fn(),
	},
}));
vi.mock("@/tools/client-schedule-service", () => mockClientScheduleService);

const mockToSchedule = vi.hoisted(() => ({
	toSchedule: vi.fn(),
}));
vi.mock("@/types/schedule", () => mockToSchedule);

describe("EditScheduleTaskPage", () => {
	test("Page", async () => {
		const toScheduleSpy = vi
			.spyOn(mockToSchedule, "toSchedule")
			.mockImplementation((schedule) => {
				expect(schedule.id).toEqual("my-test-slug-uuid");
				return {
					id: "my-test-slug-uuid",
					description: "new task !!!",
					enabled: true,
					frequency: "Recurrence",
					nextRun: new Date(),
					recurringRule: "* * * * *",
					executorType: "shell",
					executorProperties: "echo 'hello world'",
					statistics: {
						taskRunsCount: 100500,
						lastSuccess: new Date(),
						lastError: new Date(),
						inQueueCount: 146,
						errorCount: 42,
						successCount: 100354,
						currentStatus: "Something",
					},
					taskRuns: [
						{
							scheduleId: "my-test-slug-uuid",
							status: "Success",
							runAt: new Date(),
						},
						{
							scheduleId: "my-test-slug-uuid",
							status: "Failed",
							runAt: new Date(),
						},
					],
				};
			});
		const getScheduleSpy = vi
			.spyOn(mockClientScheduleService.clientSchedule, "getSchedule")
			.mockImplementation(({ id }: { id: string }) => {
				expect(id).toBe("my-test-slug-uuid");
				return Promise.resolve({
					schedule: {
						id: "my-test-slug-uuid",
					},
				});
			});
		const editScheduleTaskFormSpy = vi
			.spyOn(mockEditScheduleTaskForm, "EditScheduleTaskForm")
			.mockImplementation(({ task, mode, ...rest }) => {
				expect(mode).toBe("edit");
				expect(task).toEqual({
					id: "my-test-slug-uuid",
					description: "new task !!!",
					enabled: true,
					frequency: "Recurrence",
					nextRun: expect.any(Date),
					recurringRule: "* * * * *",
					executorType: "shell",
					executorProperties: "echo 'hello world'",
					statistics: {
						taskRunsCount: 100500,
						lastSuccess: expect.any(Date),
						lastError: expect.any(Date),
						inQueueCount: 146,
						errorCount: 42,
						successCount: 100354,
						currentStatus: "Something",
					},
					taskRuns: [
						{
							scheduleId: "my-test-slug-uuid",
							status: "Success",
							runAt: expect.any(Date),
						},
						{
							scheduleId: "my-test-slug-uuid",
							status: "Failed",
							runAt: expect.any(Date),
						},
					],
				});
				return <div {...rest} />;
			});
		const statisticsViewSpy = vi
			.spyOn(mockStatisticsView, "default")
			.mockImplementation(({ statistics, ...rest }) => {
				expect(statistics).toEqual({
					taskRunsCount: 100500,
					lastSuccess: expect.any(Date),
					lastError: expect.any(Date),
					inQueueCount: 146,
					errorCount: 42,
					successCount: 100354,
					currentStatus: "Something",
				});
				return <div {...rest} />;
			});
		const taskRunViewSpy = vi
			.spyOn(mockTaskRunView, "default")
			.mockImplementation(({ taskRuns, ...rest }) => {
				expect(taskRuns).toEqual([
					{
						scheduleId: "my-test-slug-uuid",
						status: "Success",
						runAt: expect.any(Date),
					},
					{
						scheduleId: "my-test-slug-uuid",
						status: "Failed",
						runAt: expect.any(Date),
					},
				]);
				return <div {...rest} />;
			});

		render(
			await EditScheduleTaskPage({ params: { slug: "my-test-slug-uuid" } }),
		);

		expect(getScheduleSpy).toHaveBeenCalled();
		expect(toScheduleSpy).toHaveBeenCalled();
		expect(editScheduleTaskFormSpy).toHaveBeenCalled();
		expect(statisticsViewSpy).toHaveBeenCalled();
		expect(screen.getByTestId("dashboard")).toBeDefined();
		expect(screen.getByTestId("statistics-view")).toBeDefined();
		expect(screen.getByTestId("edit-schedule-task-form")).toBeDefined();
		expect(screen.getByTestId("task-run-view")).toBeDefined();
	});
});
