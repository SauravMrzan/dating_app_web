import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";

const { getAuthTokenMock, getUserDataMock, clearAuthCookiesMock } = vi.hoisted(() => ({
  getAuthTokenMock: vi.fn(),
  getUserDataMock: vi.fn(),
  clearAuthCookiesMock: vi.fn(),
}));

vi.mock("@/lib/cookie", () => ({
  getAuthToken: getAuthTokenMock,
  getUserData: getUserDataMock,
  clearAuthCookies: clearAuthCookiesMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

import { AuthProvider, useAuth } from "./AuthContext";

function Consumer() {
  const { isAuthenticated, user, loading, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="auth">{String(isAuthenticated)}</div>
      <div data-testid="user">{user?.email ?? "none"}</div>
      <button type="button" onClick={() => void logout()}>
        Logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAuthTokenMock.mockResolvedValue(null);
    getUserDataMock.mockResolvedValue(null);
    clearAuthCookiesMock.mockResolvedValue(undefined);

    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("sets authenticated state when token and user exist", async () => {
    getAuthTokenMock.mockResolvedValue("jwt");
    getUserDataMock.mockResolvedValue({ email: "user@example.com" });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("user@example.com");
  });

  it("stays unauthenticated when no token", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("logout clears cookies and redirects", async () => {
    getAuthTokenMock.mockResolvedValue("jwt");
    getUserDataMock.mockResolvedValue({ email: "user@example.com" });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(clearAuthCookiesMock).toHaveBeenCalled();
    });

    expect(window.location.href).toBe("/login");
  });
});
