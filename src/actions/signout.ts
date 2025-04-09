"use server";

import { cookies } from "next/headers";
import { Logger } from "tslog";

import Session from "@/lib/session";

const console = new Logger();

export async function signout() {
  const cookieStore = await cookies();
  const session = new Session(cookieStore);
  const sessval = await session.start();

  console.debug(signout.name, "OK", sessval["userid"]);

  await session.destroy();

  return {
    code: 200,
    status: "OK",
    message: "user signed out",
  };
}
