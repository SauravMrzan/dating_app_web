import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { handleLoginMock, checkAuthMock, pushMock, refreshMock } = vi.hoisted(() => ({
  handleLoginMock: vi.fn(),
  checkAuthMock: vi.fn(),
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("@/lib/actions/auth-action", () => ({
  handleLogin: handleLoginMock,
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    checkAuth: checkAuthMock,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMock.mockResolvedValue(undefined);
  });

  it("shows validation errors on invalid submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "bad-email");
    await user.type(screen.getByPlaceholderText("••••••••"), "123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(await screen.findByText("Enter valid email.")).toBeInTheDocument();
    expect(await screen.findByText("Password must be atleast 6 characters")).toBeInTheDocument();
    expect(handleLoginMock).not.toHaveBeenCalled();
  });

  it("logs in regular user and navigates to dashboard", async () => {
    const user = userEvent.setup();
    handleLoginMock.mockResolvedValue({
      success: true,
      data: { role: "user" },
    });

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "user@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(handleLoginMock).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });

    expect(checkAuthMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("shows server error message on failed login", async () => {
    const user = userEvent.setup();
    handleLoginMock.mockResolvedValue({
      success: false,
      message: "Invalid email or password",
    });

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "user@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
