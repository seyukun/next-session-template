"use client";

import { Button } from "@headlessui/react";
import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isLoggedIn } from "@/actions/isLoggedIn";
import { signout } from "@/actions/signout";

export default function Page() {
  const router = useRouter();

  // Pre-check signin
  const [form, setForm] = useState(false);
  useEffect(() => {
    (async () => {
      if ((await isLoggedIn()) === false) {
        router.push("/signin");
      } else {
        setForm(true);
      }
    })();
  }, [setForm, router]);

  async function handleSignout() {
    await signout();
    router.push("/signin");
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
            <Form action={handleSignout}>
              <Button
                type="submit"
                className="mt-10 inline-flex w-full justify-center rounded-full bg-gray-950 px-4 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                Sign Out
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
