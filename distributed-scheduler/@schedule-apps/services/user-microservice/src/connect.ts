import type { ConnectRouter } from "@connectrpc/connect";
import {
	type GetUserRequest,
	UserService,
	type User,
} from "@schedule-repo/definitions/user";

import { getLogger } from "@schedule-repo/logger";
import { getServer } from ".";

const logger = getLogger("user-service:connect-routers");

export async function getUser(request: GetUserRequest) {
	console.log({ request })
	logger.info("Get user by name", request.name);
	const server = await getServer();
	const user = await server?.xPrisma.user.findByNameOrCreate(request.name);
	logger.info("User found");
	return {
		user: {
			id: user?.id,
			name: user?.name,
			isNewUser: user?.isNewUser,
		} as unknown as User
	}
};

export default (router: ConnectRouter) => {
	router.rpc(UserService, UserService.methods.getUser, getUser);
};
