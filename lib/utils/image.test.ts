import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getImageUrl } from "./image";

describe("getImageUrl", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it("returns default avatar when path is missing", () => {
    expect(getImageUrl()).toBe("/default-avatar.png");
  });

  it("returns absolute URL unchanged", () => {
    expect(getImageUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
  });

  it("joins base URL and relative path with slash", () => {
    expect(getImageUrl("uploads/img.png")).toBe("https://api.example.com/uploads/img.png");
  });

  it("handles paths that already start with slash", () => {
    expect(getImageUrl("/uploads/img.png")).toBe("https://api.example.com/uploads/img.png");
  });

  it("trims trailing slash from base URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/";
    expect(getImageUrl("/uploads/img.png")).toBe("https://api.example.com/uploads/img.png");
  });

  it("falls back to localhost base URL when env is absent", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(getImageUrl("profile.jpg")).toBe("http://localhost:5000/profile.jpg");
  });
});
