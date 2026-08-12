"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/auth";

export async function login(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/calendrier");
  const expected = process.env.APP_PASSWORD ?? "";

  if (!expected || password !== expected) {
    return { error: "Mot de passe incorrect." };
  }

  const token = await createSessionToken(process.env.AUTH_SECRET ?? "");
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(next.startsWith("/") ? next : "/calendrier");
}
