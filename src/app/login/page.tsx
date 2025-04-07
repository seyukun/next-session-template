"use client";
import { useState } from "react";

import Form from "next/form";
import Image from "next/image";

import { login } from "@/actions/login";
import { Input } from "@/component/input";
import Button from "@/component/button";
import * as Headless from "@headlessui/react";

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
            src="/next.svg"
            className="mx-auto h-10 w-auto dark:fill-white dark:invert"
            width={0}
            height={0}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {message && (
            // <div className="mb-4 rounded-md bg-red-50 p-4">
            //   <div className="flex">
            //     <div className="ml-3">
            //       <p className="text-sm/6 font-medium text-red-800">
            //         {message}
            //       </p>
            //     </div>
            //   </div>
            // </div>
            <></>
          )}
          <Headless.Dialog
            open={true}
            as="div"
            className="z-10 focus:outline-none"
            onClose={() => {}}
          >
            <div className="inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Headless.DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <Headless.DialogTitle
                    as="h3"
                    className="text-base/7 font-medium text-white"
                  >
                    Payment successful
                  </Headless.DialogTitle>
                  <p className="mt-2 text-sm/6 text-white/50">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>
                  <div className="mt-4">
                    <Headless.Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                      // onClick={close}
                    >
                      Got it, thanks!
                    </Headless.Button>
                  </div>
                </Headless.DialogPanel>
              </div>
            </div>
          </Headless.Dialog>
          <Form action={handleLogin} className="space-y-3">
            <Input label="Email Address" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <Button text="Sign in" />
          </Form>
        </div>
      </div>
    </>
  );
}
