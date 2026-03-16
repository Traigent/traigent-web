import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-[120] inline-flex items-center gap-2 rounded-full border border-indigo-300/60 bg-white/85 px-3 py-2 text-xs font-semibold text-indigo-900 shadow-lg backdrop-blur transition hover:shadow-xl dark:border-cyan-300/30 dark:bg-slate-900/85 dark:text-cyan-100"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
