import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 dark:border-violet-900/70 dark:bg-[#0b1022]">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`inline-flex h-8 items-center gap-1 rounded px-2 text-xs font-semibold transition ${!isDark ? "bg-blue-50 text-brand dark:bg-slate-800 dark:text-blue-300" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"}`}
        aria-label="Switch to light mode"
      >
        <Sun size={14} /> Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`inline-flex h-8 items-center gap-1 rounded px-2 text-xs font-semibold transition ${isDark ? "bg-blue-50 text-brand dark:bg-slate-800 dark:text-blue-300" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"}`}
        aria-label="Switch to dark mode"
      >
        <Moon size={14} /> Dark
      </button>
    </div>
  );
}
