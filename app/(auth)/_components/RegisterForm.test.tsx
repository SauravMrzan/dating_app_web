import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const { handleRegisterMock, pushMock, toastSuccessMock } = vi.hoisted(() => ({
  handleRegisterMock: vi.fn(),
  pushMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("@/lib/actions/auth-action", () => ({
  handleRegister: handleRegisterMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: toastSuccessMock,
  },
}));

vi.mock("@/lib/hooks/useAuthOptions", () => ({
  useAuthOptions: () => ({
    options: {
      cultures: ["Arab", "Asian"],
      genders: ["Male", "Female", "Other"],
      interestedIn: ["Male", "Female", "Everyone"],
    },
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dynamic options from useAuthOptions", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("option", { name: "Arab" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Male").length).toBeGreaterThan(0);
  });

  it("submits valid registration and redirects to login", async () => {
    render(<RegisterForm />);

    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("shows error banner when registration fails", async () => {
    render(<RegisterForm />);

    expect(screen.getByText("Interested In")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Male" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Female" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Everyone" })).toBeInTheDocument();
  });
});
