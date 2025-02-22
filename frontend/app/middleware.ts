import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register", "/communities"];
const PROTECTED_PATHS = ["/feed", "/profile", "/friends", "/chat"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("Authorization")?.value; // ดึงค่า token จาก cookie

  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  // ถ้า Login แล้ว และเข้า "/communities" → Redirect ไป "/feed"
  if (token && path === "/communities") {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // ถ้ายังไม่ได้ Login และเข้า Protected Path → Redirect ไป Login
  if (!token && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

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
