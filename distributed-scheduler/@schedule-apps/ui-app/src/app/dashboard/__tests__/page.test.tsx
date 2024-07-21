import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";

vi.mock("@/app/components/dashboard/dashboard", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	default: (props: any) => <div {...props}>{props.children}</div>,
}));

vi.mock("@/app/components/schedule/schedule", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	Schedule: (props: any) => <div {...props} />,
}));

describe("DashboardPage", () => {
	test("Page", () => {
		render(<DashboardPage />);
		expect(screen.getByTestId("dashboard")).toBeDefined();
		expect(screen.getByTestId("schedule")).toBeDefined();
	});
});
