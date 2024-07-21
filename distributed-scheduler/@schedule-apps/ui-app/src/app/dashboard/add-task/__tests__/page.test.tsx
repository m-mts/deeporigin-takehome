import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AddScheduleTaskPage from "../page";

vi.mock("@/app/components/dashboard/dashboard", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	default: (props: any) => <div {...props}>{props.children}</div>,
}));

const mockEditScheduleTaskForm = vi.hoisted(() => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	EditScheduleTaskForm: (props: any) => <div {...props} />,
}));

vi.mock(
	"@/app/components/dashboard/schedule-task/edit",
	() => mockEditScheduleTaskForm,
);

describe("AddScheduleTaskPage", () => {
	test("Page", () => {
		const editScheduleTaskFormSpy = vi
			.spyOn(mockEditScheduleTaskForm, "EditScheduleTaskForm")
			.mockImplementation(({ task, mode, ...rest }) => {
				expect(mode).toBe("add");
				expect(task).toEqual({
					id: "",
					description: "new task",
					enabled: true,
					frequency: "Once",
					nextRun: expect.any(Date),
					recurringRule: "",
					executorType: "shell",
					executorProperties: "",
				});
				return <div {...rest} />;
			});
		render(<AddScheduleTaskPage />);
		expect(editScheduleTaskFormSpy).toHaveBeenCalled();
		expect(screen.getByTestId("dashboard")).toBeDefined();
		expect(screen.getByTestId("edit-schedule-task-form")).toBeDefined();
	});
});
