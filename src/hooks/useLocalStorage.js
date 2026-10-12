import { useEffect, useState } from "react";
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return Array.isArray(initial)
        ? Array.isArray(saved)
          ? saved
          : initial
        : (saved ?? initial);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Browsing remains available when storage is blocked. */
    }
  }, [key, value]);
  return [value, setValue];
}
