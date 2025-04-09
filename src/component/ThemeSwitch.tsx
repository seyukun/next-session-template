"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  if (!mounted) {
    return null;
  }

  switch (theme) {
    case "light":
      return <FiSun size={30} onClick={() => setTheme("dark")} />;
    case "dark":
      return <FiMoon size={30} onClick={() => setTheme("system")} />;
    case "system":
      return <IoIosSettings size={30} onClick={() => setTheme("light")} />;
  }
};

export const ThemeSwitchDialog = () => (
  <div className="fixed right-4 bottom-4 max-w-lg space-y-4">
    <ThemeSwitch />
  </div>
);
