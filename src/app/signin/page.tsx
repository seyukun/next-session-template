"use client";

import { Button, Field, Input, Label } from "@headlessui/react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isLoggedIn } from "@/actions/isLoggedIn";
import { signin } from "@/actions/signin";

export default function Page() {
  const router = useRouter();

  // Pre-check signin
  const [form, setForm] = useState(false);
  useEffect(() => {
    (async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        router.push("/dashboard");
      } else {
        setForm(true);
      }
    })();
  }, [setForm, router]);

  // Signin message
  const [message, setMessage] = useState<string | null>(null);
  async function handleSignin(formData: FormData) {
    const result = await signin(
      String(formData.get("email")),
      String(formData.get("password")),
    );
    switch (result.code) {
      case 200:
        router.push("/dashboard");
        break;
      default:
        setMessage(result.message);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="my-10 w-[var(--container-lg)] rounded-xl bg-gray-100 max-sm:p-6 sm:p-10">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-center">
            <Image
              src="/next.svg"
              alt={"corp logo"}
              width={0}
              height={0}
              className="h-10 w-auto"
            />
          </div>
          {form ? (
            <Form action={handleSignin}>
              {message && (
                <Field className="mb-4 flex rounded-md bg-red-200 p-4">
                  <Label className="px-3 font-medium text-red-800">
                    {message}
                  </Label>
                </Field>
              )}
              <Field className="flex flex-col gap-2">
                <Label className="font-medium">Email</Label>
                <Input
                  type="email"
                  name="email"
                  className="h-10 w-full appearance-none rounded-lg bg-white px-3 outline -outline-offset-1 outline-gray-950/15 focus:outline-gray-950 data-error:outline-rose-500 sm:text-sm dark:bg-gray-50"
                  required={true}
                />
              </Field>
              <Field className="relative mt-6 flex flex-col gap-2">
                <Label className="font-medium">Password</Label>
                <Label className="absolute top-0 right-0">
                  <Link href={""}>Forgot password?</Link>
                </Label>
                <Input
                  type="password"
                  name="password"
                  className="h-10 w-full appearance-none rounded-lg bg-white px-3 outline -outline-offset-1 outline-gray-950/15 focus:outline-gray-950 data-error:outline-rose-500 sm:text-sm dark:bg-gray-50"
                  required={true}
                />
              </Field>
              <Button
                type="submit"
                className="mt-10 inline-flex w-full justify-center rounded-full bg-gray-950 px-4 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                Sign in to account
              </Button>
              <Field className="mt-6 flex gap-2">
                <Label className="text-gray-600">
                  Don{"'"}t have an account?
                </Label>
                <Link
                  className="font-semibold hover:text-gray-700"
                  href={"/signup"}
                >
                  Get access <span aria-hidden="true">→</span>
                </Link>
              </Field>
            </Form>
          ) : (
            <div className="my-20 flex justify-center">
              <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500"
                style={{ borderTopColor: "transparent" }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
