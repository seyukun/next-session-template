"use client";

import { Button, Field, Input, Label } from "@headlessui/react";
import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isLoggedIn } from "@/actions/isLoggedIn";
import { signup } from "@/actions/signup";
import isExist from "@/helper/isExist";

export default function Page() {
  const router = useRouter();

  // Pre-check signin
  const [form, setForm] = useState(false);
  useEffect(() => {
    (async () => {
      if (await isLoggedIn()) {
        router.push("/dashboard");
      } else {
        setForm(true);
      }
    })();
  }, [setForm, router]);

  // Signin message
  const [message, setMessage] = useState<string | null>(null);
  async function handleSignup(formData: FormData) {
    setForm(false);

    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("_password")?.toString();
    if (!isExist(username)) {
      setMessage("Username is required");
      return;
    }
    if (!isExist(email)) {
      setMessage("Email is required");
      return;
    }
    if (!isExist(password)) {
      setMessage("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match");
      return;
    }

    const result = await signup(username!, email!, password!);

    switch (result.code) {
      case 200:
        router.push("/signin");
        break;
      default:
        setMessage(result.message);
        setForm(true);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="my-10 w-[var(--container-lg)] rounded-xl bg-gray-100 max-sm:p-6 sm:p-10">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt={"corp logo"}
              width={0}
              height={0}
              className="h-10 w-auto"
            />
          </div>
          {form ? (
            <Form action={handleSignup}>
              {message && (
                <Field className="mb-4 flex rounded-md bg-red-200 p-4">
                  <Label className="px-3 font-medium text-red-800">
                    {message}
                  </Label>
                </Field>
              )}
              <Field className="flex flex-col gap-2">
                <Label className="font-medium">Username</Label>
                <Input
                  type="username"
                  name="username"
                  placeholder="Enter the username"
                  className="h-10 w-full appearance-none rounded-lg bg-white px-3 outline -outline-offset-1 outline-gray-950/15 focus:outline-gray-950 data-error:outline-rose-500 sm:text-sm dark:bg-gray-50"
                  required={true}
                />
              </Field>
              <Field className="mt-6 flex flex-col gap-2">
                <Label className="font-medium">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your@email.address"
                  className="h-10 w-full appearance-none rounded-lg bg-white px-3 outline -outline-offset-1 outline-gray-950/15 focus:outline-gray-950 data-error:outline-rose-500 sm:text-sm dark:bg-gray-50"
                  required={true}
                />
              </Field>
              <Field className="mt-6 flex flex-col gap-2">
                <Label className="font-medium">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter the password"
                  className="h-10 w-full appearance-none rounded-lg bg-white px-3 outline -outline-offset-1 outline-gray-950/15 focus:outline-gray-950 data-error:outline-rose-500 sm:text-sm dark:bg-gray-50"
                  required={true}
                />
              </Field>
              <Field className="mt-6 flex flex-col gap-2">
                <Label className="font-medium">Comfirm Password</Label>
                <Input
                  type="password"
                  name="_password"
                  placeholder="Comfirm the password"
                  className="h-10 w-full appearance-none rounded-lg bg-white px-3 outline -outline-offset-1 outline-gray-950/15 focus:outline-gray-950 data-error:outline-rose-500 sm:text-sm dark:bg-gray-50"
                  required={true}
                />
              </Field>
              <Button
                type="submit"
                className="mt-10 inline-flex w-full justify-center rounded-full bg-gray-950 px-4 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                Sign up
              </Button>
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
