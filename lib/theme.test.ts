import { describe, it, expect, beforeEach } from "vitest";
import {
  applyTheme,
  getStoredTheme,
  initializeTheme,
  isAppTheme,
  setTheme,
  THEME_STORAGE_KEY,
} from "./theme";

describe("theme utilities", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("validates allowed themes", () => {
    expect(isAppTheme("light")).toBe(true);
    expect(isAppTheme("dark")).toBe(true);
    expect(isAppTheme("sepia")).toBe(false);
    expect(isAppTheme(null)).toBe(false);
  });

  it("reads valid stored theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(getStoredTheme()).toBe("dark");
  });

  it("returns null for invalid stored theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "invalid");
    expect(getStoredTheme()).toBeNull();
  });

  it("applies classes and data attribute", () => {
    document.documentElement.classList.add("light");
    applyTheme("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("setTheme persists and applies", () => {
    setTheme("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("initializeTheme uses stored value over default", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const selected = initializeTheme("light");
    expect(selected).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("initializeTheme falls back to provided default", () => {
    const selected = initializeTheme("light");
    expect(selected).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});
