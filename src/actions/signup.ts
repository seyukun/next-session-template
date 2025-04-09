"use server";

import { PrismaClient } from "@prisma/client";
import { createHmac as hmac } from "crypto";
import { cookies } from "next/headers";
import { Logger } from "tslog";

import Session from "@/lib/session";

const prisma = new PrismaClient();

const console = new Logger();

export async function signup(
  username: string,
  email: string,
  password: string,
) {
  const cookieStore = await cookies();
  const session = new Session(cookieStore);
  const sessval = await session.start();

  const existUser = await prisma.user.findMany({
    where: { OR: [{ email: email }, { username: username }] },
  });
  if (existUser.length > 0) {
    console.debug(signup.name, "FAILED", username, email);
    return {
      code: 409,
      status: "Conflict",
      message: "email or username already exists",
    };
  }

  const hashpw = hmac("sha256", password).update(email).digest("hex");
  const user = await prisma.user.create({
    data: { username: username, email: email, password: hashpw },
  });

  if (user) {
    console.debug(signup.name, "OK", username, email);
    sessval["userid"] = user.id;
    return {
      code: 200,
      status: "OK",
      message: "user created",
    };
  }

  console.debug(signup.name, "FAILED", username, email);
  return {
    code: 501,
    status: "Internal Server Error",
    message: "som",
  };
}
