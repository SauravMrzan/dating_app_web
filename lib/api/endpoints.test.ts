import { describe, it, expect } from "vitest";
import { API } from "./endpoints";

describe("API endpoints", () => {
  it("has stable auth routes", () => {
    expect(API.AUTH.LOGIN).toBe("/api/auth/login");
    expect(API.AUTH.REGISTER).toBe("/api/auth/register");
    expect(API.AUTH.WHOAMI).toBe("/api/auth/whoami");
  });

  it("builds dynamic report resolve route", () => {
    expect(API.ADMIN.REPORTS.RESOLVE("r1")).toBe("/api/reports/admin/r1/resolve");
  });

  it("builds dynamic chat messages route", () => {
    expect(API.CHAT.MESSAGES("conv-1")).toBe("/api/chat/conv-1");
  });

  it("builds user by id route", () => {
    expect(API.USER.BY_ID("u-22")).toBe("/api/user/u-22");
  });

  it("builds notification read route", () => {
    expect(API.NOTIFICATION.READ("n-10")).toBe("/api/notifications/n-10/read");
  });
});
