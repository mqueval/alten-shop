import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || "default_secret"; // Remplacez par une vraie clé
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cart_session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    secrets: [sessionSecret],
    maxAge: 60 * 60 * 24 * 7, // 1 semaine
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
