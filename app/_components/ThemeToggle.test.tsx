import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const { getStoredThemeMock, setThemeMock } = vi.hoisted(() => ({
  getStoredThemeMock: vi.fn(),
  setThemeMock: vi.fn(),
}));

vi.mock("@/lib/theme", () => ({
  getStoredTheme: getStoredThemeMock,
  setTheme: setThemeMock,
}));

import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.className = "";
  });

  it("initializes from stored theme", () => {
    getStoredThemeMock.mockReturnValue("dark");

    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(button).toHaveAttribute("title", "Theme: Dark");
  });

  it("cycles light to dark on click", () => {
    getStoredThemeMock.mockReturnValue("light");

    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(button);

    expect(setThemeMock).toHaveBeenCalledWith("dark");
    expect(button).toHaveAttribute("title", "Theme: Dark");
  });
});
