import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

// Define the boundaries of your application
const publicPaths = ["/login", "/signup", "/register", "/forget-password"];
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

  // 3. AGGRESSIVE ROLE DETECTION
  // Handles different nesting levels from the cookie data
  const detectedRole = user?.role || user?.user?.role || user?.data?.role;

  console.log("-----------------------------------------");
  console.log("🚀 Current Path:", pathname);
  console.log("🔑 Detected Role:", detectedRole);

  // --- LOGIC GATE 1: UNAUTHORIZED USERS ---
  // If the user is NOT logged in and tries to access a protected area
  if (!user && isProtectedRoute) {
    console.log(" Unauthorized: Redirecting to Login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- LOGIC GATE 2: LOGGED-IN USERS ON PUBLIC PAGES ---
  // If user is ALREADY logged in, don't let them see the Login/Signup page
  if (user && isPublicPath) {
    const target = detectedRole === "admin" ? "/admin/dashboard" : "/dashboard";
    console.log(`✅ Already Logged In: Redirecting to ${target}`);
    return NextResponse.redirect(new URL(target, req.url));
  }

  // --- LOGIC GATE 3: PERMISSION CHECK ---
  // Ensure "user" cannot enter "/admin" territory
  if (user && pathname.startsWith("/admin")) {
    if (detectedRole !== "admin") {
      console.log("⛔ Access Denied: User attempted to enter Admin Zone.");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // --- LOGIC GATE 4: ADMIN ACCESS TO USER AREAS ---
  // If an admin accidentally hits a standard user path, we can allow it or force redirect
  // For this course, we let Admin browse user paths

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
    "/forget-password",
  ],
};
