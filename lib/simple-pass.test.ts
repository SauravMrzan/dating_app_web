import { describe, expect, it } from "vitest";
import { API } from "@/lib/api/endpoints";
import { getImageUrl } from "@/lib/utils/image";
import { loginSchema, registerSchema } from "@/app/(auth)/schema";

describe("API endpoint constants", () => {
  it("auth login endpoint is stable", () => {
    expect(API.AUTH.LOGIN).toBe("/api/auth/login");
  });

  it("auth register endpoint is stable", () => {
    expect(API.AUTH.REGISTER).toBe("/api/auth/register");
  });

  it("admin reports list endpoint is stable", () => {
    expect(API.ADMIN.REPORTS.LIST).toBe("/api/reports/admin");
  });

  it("admin resolve endpoint includes report id", () => {
    expect(API.ADMIN.REPORTS.RESOLVE("r1")).toBe("/api/reports/admin/r1/resolve");
  });

  it("chat base endpoint is stable", () => {
    expect(API.CHAT.BASE).toBe("/api/chat");
  });

  it("chat messages endpoint includes conversation id", () => {
    expect(API.CHAT.MESSAGES("c123")).toBe("/api/chat/c123");
  });

  it("user by id endpoint includes user id", () => {
    expect(API.USER.BY_ID("u7")).toBe("/api/user/u7");
  });

  it("notification read endpoint includes notification id", () => {
    expect(API.NOTIFICATION.READ("n9")).toBe("/api/notifications/n9/read");
  });

});

describe("getImageUrl utility", () => {
  it("returns default avatar when path is undefined", () => {
    expect(getImageUrl(undefined)).toBe("/default-avatar.png");
  });

  it("returns default avatar when path is empty string", () => {
    expect(getImageUrl("")).toBe("/default-avatar.png");
  });

  it("returns absolute http path unchanged", () => {
    expect(getImageUrl("http://cdn.site/avatar.png")).toBe(
      "http://cdn.site/avatar.png",
    );
  });

  it("returns absolute https path unchanged", () => {
    expect(getImageUrl("https://cdn.site/avatar.png")).toBe(
      "https://cdn.site/avatar.png",
    );
  });

  it("joins default base URL with leading slash path", () => {
    expect(getImageUrl("/uploads/a.png")).toBe(
      "http://localhost:5000/uploads/a.png",
    );
  });

  it("joins default base URL with non-leading slash path", () => {
    expect(getImageUrl("uploads/a.png")).toBe(
      "http://localhost:5000/uploads/a.png",
    );
  });
});

describe("auth schemas", () => {
  it("login schema accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret1",
    });

    expect(result.success).toBe(true);
  });

  it("login schema rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "secret1",
    });

    expect(result.success).toBe(false);
  });

  it("login schema rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("register schema accepts minimal valid required fields", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
      fullName: "Jane Doe",
    });

    expect(result.success).toBe(true);
  });

  it("register schema rejects missing fullName", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
    });

    expect(result.success).toBe(false);
  });

  it("register schema rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "bad",
      password: "secret1",
      fullName: "Jane Doe",
    });

    expect(result.success).toBe(false);
  });

  it("register schema rejects short password", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "123",
      fullName: "Jane Doe",
    });

    expect(result.success).toBe(false);
  });

  it("register schema accepts valid gender", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
      fullName: "Jane Doe",
      gender: "Female",
    });

    expect(result.success).toBe(true);
  });

  it("register schema rejects invalid gender", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
      fullName: "Jane Doe",
      gender: "Unknown",
    });

    expect(result.success).toBe(false);
  });

  it("register schema accepts interestedIn Everyone", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
      fullName: "Jane Doe",
      interestedIn: "Everyone",
    });

    expect(result.success).toBe(true);
  });

  it("register schema rejects negative minPreferredAge", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
      fullName: "Jane Doe",
      minPreferredAge: -1,
    });

    expect(result.success).toBe(false);
  });

  it("register schema rejects non-integer maxPreferredAge", () => {
    const result = registerSchema.safeParse({
      email: "new@example.com",
      password: "secret1",
      fullName: "Jane Doe",
      maxPreferredAge: 25.5,
    });

    expect(result.success).toBe(false);
  });
});

describe("integration-style combinations", () => {
  it("uses validated email to build user endpoint", () => {
    const parsed = registerSchema.parse({
      email: "person@example.com",
      password: "secret1",
      fullName: "Person One",
    });

    expect(parsed.email).toContain("@");
    expect(API.USER.BY_ID("person-id")).toBe("/api/user/person-id");
  });

  it("parses login and keeps chat endpoint callable", () => {
    const parsed = loginSchema.parse({
      email: "chat@example.com",
      password: "secret1",
    });

    expect(parsed.email).toBe("chat@example.com");
    expect(API.CHAT.MESSAGES("room-1")).toBe("/api/chat/room-1");
  });

  it("builds image URL from path after valid register parse", () => {
    const parsed = registerSchema.parse({
      email: "img@example.com",
      password: "secret1",
      fullName: "Image User",
    });

    expect(parsed.fullName).toBe("Image User");
    expect(getImageUrl("avatars/u1.png")).toBe(
      "http://localhost:5000/avatars/u1.png",
    );
  });

  it("keeps report resolve endpoint deterministic", () => {
    expect(API.ADMIN.REPORTS.RESOLVE("42")).toBe(
      "/api/reports/admin/42/resolve",
    );
    expect(API.ADMIN.REPORTS.RESOLVE("42")).toBe(
      "/api/reports/admin/42/resolve",
    );
  });
});
