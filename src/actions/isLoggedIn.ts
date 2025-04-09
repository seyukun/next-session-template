"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

import isExist from "@/helper/isExist";
import Session from "@/lib/session";

const prisma = new PrismaClient();

export async function isLoggedIn() {
  const cookieStore = await cookies();
  console.debug(isLoggedIn.name, "cookies before", cookieStore.getAll());
  const session = new Session(cookieStore);
  const sessval = await session.start();
  const userId = sessval["userid"];

  const user = isExist(userId)
    ? await prisma.user.findUnique({
        where: { id: userId },
      })
    : undefined;

  return isExist(user);
}
