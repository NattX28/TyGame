import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

// Paths ที่ไม่ต้องการการ authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/communities"];

// Paths ที่ต้องการการ authentication
const PROTECTED_PATHS = ["/feed", "/profile", "/friends", "/chat"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // เช็คว่าเป็น public path หรือไม่
  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // เช็คว่าเป็น protected path หรือไม่
  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  try {
    const { data } = await axios.get("/api/auth/check", {
      headers: { cookie: request.headers.get("cookie") || "" },
      withCredentials: true,
    });

    const isAuthenticated = data.authenticated;

    if (isAuthenticated && path === "/communities") {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    if (!isAuthenticated && isProtectedPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", path);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    if (isProtectedPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// กำหนด path ที่จะใช้ middleware
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/communities",
    "/feed/:path*",
    "/profile/:path*",
    "/friends/:path*",
    "/chat/:path*",
    "/admin/:path*",
  ],
};
