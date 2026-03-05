import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./schema";

describe("auth schemas", () => {
  it("accepts valid login payload", () => {
    const parsed = loginSchema.parse({
      email: "user@example.com",
      password: "secret123",
    });

    expect(parsed.email).toBe("user@example.com");
  });

  it("rejects invalid login email", () => {
    const result = loginSchema.safeParse({
      email: "bad-email",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("accepts minimal valid register payload", () => {
    const result = registerSchema.parse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(result.role).toBe("user");
  });

  it("rejects register payload with short fullName", () => {
    const result = registerSchema.safeParse({
      fullName: "J",
      email: "jane@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid enum values", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      gender: "Robot",
    });

    expect(result.success).toBe(false);
  });

  it("accepts full optional register payload", () => {
    const result = registerSchema.parse({
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
      phone: "1234567890",
      gender: "Male",
      dateOfBirth: "1996-02-01",
      culture: "Arab",
      interestedIn: "Female",
      preferredCulture: ["Arab", "Asian"],
      minPreferredAge: 21,
      maxPreferredAge: 35,
      role: "admin",
    });

    expect(result.role).toBe("admin");
    expect(result.preferredCulture).toHaveLength(2);
  });
});
