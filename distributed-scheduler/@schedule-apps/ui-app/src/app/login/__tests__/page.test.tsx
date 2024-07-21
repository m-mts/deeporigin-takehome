import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "../page";

vi.mock("@/app/components/login/form", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock
	Form: (props: any) => <div {...props} />,
}));

describe("LoginPage", () => {
	test("Page", () => {
		render(<LoginPage />);
		expect(screen.getByTestId("login-form")).toBeDefined();
	});
});
