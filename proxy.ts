import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

// Define the boundaries of your application
const publicPaths = ["/login", "/signup", "/register", "/forgot-password"];
const authRestrictedPaths = [
  "/admin",
  "/user",
  "/dashboard",
  "/update-profile",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Fetch Identity Data
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  // 2. Identify current location type
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isProtectedRoute = authRestrictedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // 3. Role detection
  const detectedRole = user?.role || user?.user?.role || user?.data?.role;

  console.log("-----------------------------------------");
  console.log("🚀 Current Path:", pathname);
  console.log("🔑 Detected Role:", detectedRole);

  // --- LOGIC GATE 1: UNAUTHORIZED USERS ---
  if (!user && isProtectedRoute) {
    console.log(" Unauthorized: Redirecting to Login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- LOGIC GATE 2: LOGGED-IN USERS ON PUBLIC PAGES ---
  if (user && isPublicPath) {
    const target = detectedRole === "admin" ? "/admin/dashboard" : "/dashboard";
    console.log(`✅ Already Logged In: Redirecting to ${target}`);
    return NextResponse.redirect(new URL(target, req.url));
  }

  // --- LOGIC GATE 3: PERMISSION CHECK ---
  if (user && pathname.startsWith("/admin")) {
    if (detectedRole !== "admin") {
      console.log("⛔ Access Denied: User attempted to enter Admin Zone.");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // --- LOGIC GATE 4: Admin access to user areas ---
  // Admin can browse user paths

  return NextResponse.next();
}

// Ensure the middleware runs on these specific routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/update-profile/:path*",
    "/login",
    "/signup",
    "/register",
    "/forgot-password", // ✅ corrected spelling
  ],
};
