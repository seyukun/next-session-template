"use client";

import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { isLoggedIn } from "@/actions/isLoggedIn";

export default function Dashboard() {
  const router = useRouter();

  // Pre-check signin
  useEffect(() => {
    (async () => {
      if ((await isLoggedIn()) === false) {
        router.push("/signin");
      }
    })();
  }, [router]);

  return (
    <main>
      <Button
        type="button"
        onClick={async () => {
          router.push("/signout");
        }}
      >
        logout
      </Button>
    </main>
  );
}
