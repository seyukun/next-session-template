import KeyvRedis from "@keyv/redis";
import crypto from "crypto";
import Keyv from "keyv";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Logger } from "tslog";

const keyv = new Keyv<SessionValue>(
  new KeyvRedis({ url: "redis://localhost:6379" }),
);

const console = new Logger();

type SessionValue = {
  [key: string]: string;
};

export default class Session {
  constructor(private cookies: ReadonlyRequestCookies) {}

  public id: string | undefined = undefined;
  private value: SessionValue = {};
  private ttl = 60 * 30 * 1000; // 30 minutes

  public async start(): Promise<SessionValue> {
    const sessionId = this.cookies.get("sessid")?.value;

    if (sessionId !== undefined) {
      const sessionValue = await keyv.get(sessionId);
      console.debug(
        Session.name,
        this.start.name,
        "sessionId",
        sessionId,
        sessionValue,
      );
      if (sessionValue !== undefined) {
        this.id = sessionId;
        this.value = sessionValue;
        this.value.updatedAt = new Date(Date.now() + this.ttl).toISOString();
        console.debug(
          Session.name,
          this.start.name,
          "session exists",
          this.id,
          sessionValue,
          this.value,
        );
      } else {
        this.id = crypto.randomBytes(16).toString("hex");
        this.value = {
          updatedAt: new Date(Date.now() + this.ttl).toISOString(),
        };
        console.debug(
          Session.name,
          this.start.name,
          "session expired",
          this.id,
          this.value,
        );
        await keyv.set(this.id, this.value, this.ttl);
      }
    } else {
      this.id = crypto.randomBytes(16).toString("hex");
      this.value = {
        updatedAt: new Date(Date.now() + this.ttl).toISOString(),
      };
      console.debug(
        Session.name,
        this.start.name,
        "session not exists, create new",
        this.id,
        this.value,
      );
    }
    await keyv.set(this.id, this.value, this.ttl);
    this.cookies.set("sessid", this.id, {
      path: "/",
      expires: new Date(Date.now() + this.ttl),
    });
    return this.createAutoSavingProxy(this.value);
  }

  public async destroy(): Promise<void> {
    if (this.id === undefined) {
      this.id = this.cookies.get("sessid")?.value;
    }

    if (this.id !== undefined) {
      await keyv.delete(this.id);
      this.id = undefined;
      this.value = {};
      this.cookies.delete("sessid");
      return;
    }
  }

  public async regenerate(): Promise<void> {
    if (this.id === undefined) {
      return undefined;
    }

    const prevId = this.id;
    this.id = crypto.randomBytes(16).toString("hex");

    await keyv.set(this.id, this.value, this.ttl);
    await keyv.delete(prevId);

    this.cookies.set("sessid", this.id, {
      path: "/",
      expires: new Date(Date.now() + this.ttl),
    });

    return;
  }

  public setTtl(ttl: number): number {
    this.ttl = ttl;
    return ttl;
  }

  private createAutoSavingProxy(target: SessionValue): SessionValue {
    const handler: ProxyHandler<SessionValue> = {
      set: (target, prop, value, receiver) => {
        const result = Reflect.set(target, prop, value, receiver);
        setTimeout(async () => {
          await keyv.set(this.id!, target, this.ttl);
          console.debug(
            Session.name,
            this.createAutoSavingProxy.name,
            this.id,
            prop,
            value,
          );
        }, 0);
        return result;
      },
    };
    const proxy = new Proxy(target, handler);
    console.debug(
      Session.name,
      this.createAutoSavingProxy.name,
      this.id,
      "create proxy",
      proxy,
    );
    return proxy;
  }
}
