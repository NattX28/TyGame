import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATHS = ["/admin"];
const PUBLIC_PATHS = ["/", "/communities", "/login", "/register"];
const PROTECTED_PATHS = ["/feed", "/profile", "/chat"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("Authorization")?.value; // ดึง token

  // ดึง role จาก token หรือ session
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
      userRole = payload.role;
    } catch (err) {
      console.error("Invalid Token");
    }
  }

  const isPublicPath = PUBLIC_PATHS.some((publicPath) =>
    path.startsWith(publicPath)
  );

  const isProtectedPath = PROTECTED_PATHS.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  const isAdminPath = ADMIN_PATHS.some((adminPath) =>
    path.startsWith(adminPath)
  );

  // ถ้ายังไม่ได้ login และเข้าหน้า Protected Path → Redirect ไป Login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ป้องกันหน้า admin สำหรับคนที่ไม่ใช่ admin
  if (isAdminPath && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
