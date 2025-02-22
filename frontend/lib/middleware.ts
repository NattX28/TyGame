import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

// ระบุ paths ที่ไม่ต้องการการ authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/communities"];

// ระบุ paths ที่ต้องการการ authentication
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
    //  base URL
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`,
      {
        headers: { cookie: request.headers.get("cookie") || "" },
        withCredentials: true,
      }
    );

    const isAuthenticated = data.authenticated;

    // กรณีที่ผู้ใช้ auth แล้วแต่เข้าหน้า communities ให้ redirect ไปที่ /feed
    if (isAuthenticated && path === "/communities") {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    // ถ้าไม่ auth และเข้าหน้า protected ให้ redirect ไปหน้า login
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

// กำหนด paths ที่จะใช้ middleware
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
