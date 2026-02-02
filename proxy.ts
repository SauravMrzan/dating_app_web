import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

const publicPaths = ["/login", "/signup", "/register", "/forget-password"];
const authRestrictedPaths = ["/admin", "/user", "/dashboard"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Move all declarations to the top
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isProtectedRoute = authRestrictedPaths.some((path) => pathname.startsWith(path));

  // 2. AGGRESSIVE ROLE DETECTION
  const detectedRole = user?.role || user?.user?.role || user?.data?.role;

  console.log("🚀 Path:", pathname);
  console.log("👤 Raw User Cookie:", JSON.stringify(user));
  console.log("🔑 Detected Role:", detectedRole);

  // 3. Logic - Now using variables that are fully declared above
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user && isPublicPath) {
    const target = detectedRole === "admin" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(target, req.url));
  }

  if (user && isProtectedRoute) {
    // Protect Admin routes
    if (pathname.startsWith("/admin") && detectedRole !== "admin") {
      console.log("⛔ Access Denied to Admin: Redirecting to Dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/update-profile/:path*",
    "/login",
    "/signup",
    "/register",
    "/forget-password",
  ],
};