import crypto from "crypto";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { keyv, type SessionValue } from "@/lib/db/keyv";

// const console = new Logger();

export default class Session {
  constructor(private cookies: ReadonlyRequestCookies) {}

  public id: string | undefined = undefined;
  private value: SessionValue = {};
  private ttl = 60 * 30 * 1000; // 30 minutes

  public async start(): Promise<SessionValue> {
    // init
    this.id = undefined;

    // check if session exists
    const sessionId = this.cookies.get("sessid")?.value;

    // check if session exists in cookie and keyv
    if (sessionId !== undefined) {
      const sessionValue = await keyv.get(sessionId);
      if (sessionValue !== undefined) {
        this.id = sessionId;
        this.value = sessionValue;
        this.value.updatedAt = new Date(Date.now() + this.ttl).toISOString();
      }
    }

    // if session does not exist, create a new one
    if (this.id === undefined) {
      this.id = crypto.randomBytes(16).toString("hex");
      this.value = {
        updatedAt: new Date(Date.now() + this.ttl).toISOString(),
      };
    }

    // set session in keyv and cookie
    await keyv.set(this.id!, this.value, this.ttl);
    this.cookies.set("sessid", this.id!, {
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
        }, 0);
        return result;
      },
    };
    const proxy = new Proxy(target, handler);
    return proxy;
  }
}
