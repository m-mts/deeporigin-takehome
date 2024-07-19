import type { SessionOptions } from "iron-session";

export interface SessionData {
  user: {
    id: string;
    name: string;
  }
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  user: { id: "", name: "" },
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  cookieOptions: {
    // secure only works in `https` environments
    secure: process.env.NODE_ENV === "production",
  },
};
