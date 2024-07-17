import { describe, expect, mock, spyOn, test } from "bun:test";
import { type UserAppServer, configure } from "./index";

describe("User Service", () => {
	test("should have a .env server and port", () => {
		const server = { register: () => {}, listen: () => {} } as UserAppServer;
		const spyServerListen = spyOn(server, "listen");

		configure(server);

		expect(spyServerListen).toHaveBeenCalledWith({
			host: "my-test-host",
			port: 12345,
		});
	});
});
