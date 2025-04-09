import KeyvRedis from "@keyv/redis";
import Keyv from "keyv";
import { env } from "process";

export type SessionValue = {
  [key: string]: string;
};

/* eslint-disable no-var */
declare global {
  var keyv: Keyv<SessionValue> | undefined;
}

if (globalThis["keyv"] === undefined) {
  if (env.NODE_ENV === "production" || env.SESSION_STORE === "redis") {
    globalThis["keyv"] = new Keyv<SessionValue>(
      new KeyvRedis(env.REDIS_URL ?? "redis://localhost:6379"),
    );
  } else {
    globalThis["keyv"] = new Keyv<SessionValue>();
  }
}

export const keyv = globalThis["keyv"] as Keyv<SessionValue>;
