import { UserService } from "@schedule-repo/definitions/user";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

export const transport = createGrpcWebTransport({
    baseUrl: process.env.USER_SERVICE_URL ?? "http://localhost:8080"
});

export const clientUser = createPromiseClient(UserService, transport);