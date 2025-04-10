"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      router.push("/signin");
    })();
  }, [router]);

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
          <div className="my-20 flex justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500"
              style={{ borderTopColor: "transparent" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
