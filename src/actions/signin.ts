"use server";

import { PrismaClient } from "@prisma/client";
import { createHmac as hmac } from "crypto";
import { cookies } from "next/headers";
import { Logger } from "tslog";

import Session from "@/lib/session";

const prisma = new PrismaClient();

const console = new Logger();

export async function signin(email: string, password: string) {
  const cookieStore = await cookies();
  const session = new Session(cookieStore);
  const sessval = await session.start();

  const hashpw = hmac("sha256", password).update(email).digest("hex");
  const user = await prisma.user.findUnique({
    where: { email: email, password: hashpw },
  });

  if (user) {
    console.debug(signin.name, "OK", email);
    sessval["userid"] = user.id;
    session.regenerate();
    return {
      code: 200,
      status: "OK",
      message: "user signed in",
    }
  }

  console.debug(signin.name, "FAILED", email);
  return {
    code: 401,
    status: "Unauthorized",
    message: "email or password is incorrect",
  };
}
