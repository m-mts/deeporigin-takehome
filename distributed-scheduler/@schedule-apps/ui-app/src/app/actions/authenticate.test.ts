//COMMENTED OUT BECAUSE OF RESTORING MODULE ERROR IN BUN
//to run independently - uncomment and in ui-app folder:
//bun test ./src/app/actions/authenticate.test.ts 

// import { describe, expect, test, beforeEach, afterEach, spyOn, mock, jest } from "bun:test";

// const defaultSessionMock = {
//     isLoggedIn: false,
//     user: { id: "000", name: "default user" }
// }
// mock.module("./tools/session", () => ({ sessionOptions: {}, defaultSession: {} }));
// mock.module("next/headers", () => ({ cookies: mock() }));
// const revalidatePathMock = { revalidatePath: mock() };
// mock.module("next/cache", () => (revalidatePathMock));
// const redirectMock = { redirect: mock() };
// mock.module("next/navigation", () => (redirectMock));
// const sessionMock = {
//     isLoggedIn: false,
//     user: null,
//     save: mock(),
//     destroy: mock(),
// };
// mock.module("iron-session", () => ({
//     getIronSession: mock().mockReturnValue(sessionMock),
// }));
// import { login, logout, getSession } from "./authenticate";

// describe("authenticate tests", () => {
//     afterEach(() => {
//         jest.restoreAllMocks();
//     });
//     test("should login successfully", async () => {
//         const formData = new FormData();
//         formData.append("username", "testuser");

//         const saveSpy = spyOn(sessionMock, "save");
//         const redirectSpy = spyOn(redirectMock, "redirect");
//         const revalidatePathSpy = spyOn(revalidatePathMock, "revalidatePath");
//         await login(formData);

//         expect((await getSession()).user.name).toEqual("testuser");

//         expect((await getSession()).isLoggedIn).toBe(true);
//         expect(saveSpy).toHaveBeenCalled();
//         expect(redirectSpy).toHaveBeenCalledWith("/dashboard");
//         expect(revalidatePathSpy).toHaveBeenCalledWith("/login");
//     });

//     test("should logout successfully", async () => {
//         const destroySpy = spyOn(sessionMock, "destroy");
//         const redirectSpy = spyOn(redirectMock, "redirect");
//         const revalidatePathSpy = spyOn(revalidatePathMock, "revalidatePath");

//         await logout();

//         expect((await getSession()).isLoggedIn).toBe(false);

//         expect(destroySpy).toHaveBeenCalled()
//         expect(redirectSpy).toHaveBeenCalledWith("/login");
//         expect(revalidatePathSpy).toHaveBeenCalledWith("/logout");
//     });
// });