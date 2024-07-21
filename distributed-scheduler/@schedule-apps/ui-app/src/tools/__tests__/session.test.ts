import { describe, expect, test } from "vitest";
import { defaultSession, sessionOptions } from "@/tools/session";

describe("Session Tests", () => {
    test("should have default session data", () => {
        expect(defaultSession).toEqual({
            user: { id: "", name: "" },
            isLoggedIn: false,
        });
    });

    test("should have session options with correct properties", () => {
        expect(sessionOptions).toEqual({
            password: process.env.SESSION_PASSWORD as string,
            cookieName: process.env.SESSION_COOKIE_NAME as string,
            cookieOptions: {
                secure: process.env.NODE_ENV === "production",
            },
        });
    });

    test("should have a boolean value for the secure cookie option", () => {
        expect(typeof sessionOptions.cookieOptions?.secure).toBe("boolean");
    });
});