import { useEffect, useState } from "react";

// useSharedSetting — useState that persists to localStorage and syncs across
// tabs / pages. Used to keep ROI and TTM calculators in sync on shared
// engineering parameters (e.g. hourly rate, monthly LLM spend).
//
// const [hourlyRate, setHourlyRate] = useSharedSetting("traigent_hourly_rate", 150);
export function useSharedSetting(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return defaultValue;
      const parsed = JSON.parse(stored);
      return parsed === undefined ? defaultValue : parsed;
    } catch {
      return defaultValue;
    }
  });

  // Persist on every change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota / privacy mode — ignore */ }
  }, [key, value]);

  // Pick up changes from other tabs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue));
      } catch { /* ignore malformed value */ }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [value, setValue];
}
