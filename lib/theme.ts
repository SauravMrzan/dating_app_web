export type AppTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isAppTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): AppTheme | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return isAppTheme(value) ? value : null;
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
}

export function setTheme(theme: AppTheme) {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  applyTheme(theme);
}

export function initializeTheme(defaultTheme: AppTheme = "light") {
  const storedTheme = getStoredTheme();
  const theme = storedTheme ?? defaultTheme;
  applyTheme(theme);
  return theme;
}
