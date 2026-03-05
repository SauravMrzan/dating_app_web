import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

const { initializeThemeMock } = vi.hoisted(() => ({
  initializeThemeMock: vi.fn(),
}));

vi.mock("@/lib/theme", () => ({
  initializeTheme: initializeThemeMock,
}));

import ThemeInitializer from "./ThemeInitializer";

describe("ThemeInitializer", () => {
  it("initializes theme once on mount", () => {
    render(<ThemeInitializer />);

    expect(initializeThemeMock).toHaveBeenCalledTimes(1);
    expect(initializeThemeMock).toHaveBeenCalledWith("light");
  });
});
