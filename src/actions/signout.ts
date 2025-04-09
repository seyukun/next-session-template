"use server";

import { cookies } from "next/headers";

import Session from "@/lib/session";

export async function signout() {
  const cookieStore = await cookies();
  const session = new Session(cookieStore);
  await session.start();

  await session.destroy();

  return {
    code: 200,
    status: "OK",
    message: "user signed out",
  };
}
