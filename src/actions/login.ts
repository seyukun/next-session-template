"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Logger } from "tslog";
import { PrismaClient } from "@prisma/client";
import { createHmac as hmac } from "crypto";

import Session from "@/lib/session";

const prisma = new PrismaClient();

const console = new Logger();

export async function login(email: string, password: string) {
  const session = new Session(await cookies());
  const sessval = await session.start();

  const userid = sessval["userid"];

  const hashpw = hmac("sha256", password).update(email).digest("hex");

  const user = await prisma.user.findUnique({
    where: { email: email, password: hashpw },
  });

  if (user) {
    return redirect("/dashboard");
  } else {
    return {
      code: 401,
      status: "Unauthorized",
      message: "email or password is incorrect",
    };
  }
}
