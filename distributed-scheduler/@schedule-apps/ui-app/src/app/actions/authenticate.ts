import type { SessionData } from "@/tools/session";
import { defaultSession, sessionOptions } from "@/tools/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clientUser } from "@/tools/client-user-service";
import { getLogger } from "@schedule-repo/logger";

const logger = getLogger("ui-app:authenticate");

type User = {
  id: string;
  name: string;
};

export async function getSession() {
  return await getIronSession<SessionData>(cookies(), sessionOptions);
}

export async function logout() {
  "use server";
  const session = await getSession();
  session.isLoggedIn = false;
  session.destroy();
  revalidatePath("/logout");
  redirect("/login");
}

export async function login(formData: FormData) {
  "use server";
  const session = await getSession();
  const formUserName = (formData.get("username") as string) ?? "No username";

  logger.info('User logged in', formUserName);

  try {
    const userResponse = await clientUser.getUser({ name: formUserName });
    session.user = userResponse.user as User;
    session.isLoggedIn = true;
  } catch (error) {
    session.user = defaultSession.user;
    session.isLoggedIn = defaultSession.isLoggedIn;

    logger.error('Error getting user', error);
  }
  finally {
    await session.save();
    revalidatePath("/login");
    redirect("/dashboard");
  }
}