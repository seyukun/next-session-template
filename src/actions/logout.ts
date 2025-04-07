"use server";

import { cookies } from "next/headers";
import Session from "@/lib/session";
import { Logger } from "tslog";

const console = new Logger();

export async function logout() {
  const session = new Session(await cookies());
  await session.start();
  await session.destroy();
}
