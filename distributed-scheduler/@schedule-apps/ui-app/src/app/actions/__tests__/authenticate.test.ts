import { describe, expect, test, vi } from "vitest";

const defaultSessionMock = {
    isLoggedIn: false,
    user: { id: "000", name: "default user" }
}
vi.mock("@/tools/session", () => ({ sessionOptions: vi.fn, defaultSession: {} }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
const revalidatePathMock = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock("next/cache", () => (revalidatePathMock));
const redirectMock = vi.hoisted(() => ({ redirect: vi.fn() }));
vi.mock("next/navigation", () => (redirectMock));

vi.mock("@/tools/client-user-service", () => (
    {
        clientUser: {
            getUser: vi.fn().mockResolvedValue({
                user: {
                    id: "123",
                    name: "testUser"
                }
            })
        }
    }));

const sessionMock = vi.hoisted(() => ({
    isLoggedIn: false,
    user: null,
    save: vi.fn(),
    destroy: vi.fn(),
}));

vi.mock("iron-session", () => ({
    getIronSession: () => sessionMock,
}));

import { login, logout, getSession } from "../authenticate";

describe("authenticate tests", () => {
    test("should login successfully", async () => {
        const formData = new FormData();
        formData.append("username", "testUser");

        const saveSpy = vi.spyOn(sessionMock, "save");
        const redirectSpy = vi.spyOn(redirectMock, "redirect");
        const revalidatePathSpy = vi.spyOn(revalidatePathMock, "revalidatePath");
        await login(formData);

        expect((await getSession()).user.name).toEqual("testUser");

        expect((await getSession()).isLoggedIn).toBe(true);

        expect(saveSpy).toHaveBeenCalled();
        expect(redirectSpy).toHaveBeenCalledWith("/dashboard");
        expect(revalidatePathSpy).toHaveBeenCalledWith("/login");
    });

    test("should logout successfully", async () => {
        const destroySpy = vi.spyOn(sessionMock, "destroy");
        const redirectSpy = vi.spyOn(redirectMock, "redirect");
        const revalidatePathSpy = vi.spyOn(revalidatePathMock, "revalidatePath");

        await logout();

        expect((await getSession()).isLoggedIn).toBe(false);

        expect(destroySpy).toHaveBeenCalled()
        expect(redirectSpy).toHaveBeenCalledWith("/login");
        expect(revalidatePathSpy).toHaveBeenCalledWith("/logout");
    });
});