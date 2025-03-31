import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/explore", "/login", "/register"];
const PROTECTED_PATHS = ["/feed", "/profile", "/chat", "/community", "/party", "/friends"];
const ADMIN_PATHS = ["/admin"];
const ALL_VALID_PATHS = [...PUBLIC_PATHS, ...PROTECTED_PATHS, ...ADMIN_PATHS];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("Authorization")?.value;

  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role;
    } catch (err) {
      console.error("Invalid Token");
    }
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  const isAdminPath = ADMIN_PATHS.some(
    (adminPath) => path === adminPath || path.startsWith(`${adminPath}/`)
  );

  const isValidPath = ALL_VALID_PATHS.some(
    (validPath) => path === validPath || path.startsWith(`${validPath}/`)
  );

  if (!isValidPath) {
    return NextResponse.redirect(new URL("/404", request.url)); // Redirect to a 404 page for invalid paths
  }

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPath && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
