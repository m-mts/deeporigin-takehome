import { describe, expect, mock, spyOn, test } from "bun:test";
import type { GetUserRequest } from "@schedule-repo/definitions";
import { getUser } from "./connect";

const serverMock = {
	xPrisma: {
		user: {
			findByNameOrCreate: mock().mockResolvedValue({
				id: "::UUID::",
				name: "John Doe",
				isNewUser: true,
			}),
		},
	},
};

mock.module("./", () => ({
	getServer: () => serverMock,
}));

const loggerMock = {
	info: mock(),
};

mock.module("@schedule-repo/logger", () => ({
	getLogger: () => loggerMock,
}));

describe("getUser", () => {
	test("should get user by name", async () => {
		const request = {
			name: "John Doe",
		} as GetUserRequest;

		const responce = await getUser(request);

		expect(responce).toEqual({
			user: {
				id: "::UUID::",
				name: "John Doe",
				isNewUser: true,
			},
		});
	});
});
