"use server";

import { PrismaClient } from "@prisma/client";
import { createHmac as hmac } from "crypto";
import { cookies } from "next/headers";

import Session from "@/lib/session";

const prisma = new PrismaClient();

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
    sessval["userid"] = user.id;
    return {
      code: 200,
      status: "OK",
      message: "user created",
    };
  }

  return {
    code: 501,
    status: "Internal Server Error",
    message: "som",
  };
}
