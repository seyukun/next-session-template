"use client";

import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return (
    mounted && (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}
      >
        {children}
      </ThemeProvider>
    )
  );
}
