"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark") ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ||
      localStorage.getItem("theme") === "dark";

    if (isDark) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded border border-border-subtle bg-subtle flex items-center justify-center opacity-70",
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      className={cn(
        "relative w-8 h-8 rounded border border-border-subtle bg-surface hover:bg-subtle text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-1 focus-visible:ring-accent",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-accent transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-accent transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
