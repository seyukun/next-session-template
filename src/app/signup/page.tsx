"use client";
import Form from "next/form";
import Image from "next/image";

import { login } from "@/actions/login";
import { Input } from "./input";
import { useState } from "react";

export default function Page() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const result = await login(
      String(formData.get("email")),
      String(formData.get("password"))
    );
    setMessage(result.message);
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {message && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm/6 font-medium text-red-800">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}
          <Form action={handleLogin} className="space-y-6">
            <Input label="Email Address" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
