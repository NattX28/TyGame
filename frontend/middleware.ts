import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATHS = ["/void"]; // เดี๋ยวมาแก้
// real
// const PUBLIC_PATHS = ["/", "/communities", "/login", "/register"];
// test
const PUBLIC_PATHS = [
  "/",
  "/communities",
  "/login",
  "/register",
  "/feed",
  "/profile",
  "/chat",
  "/admin",
  "/admin/dashboard",
  "/admin/communities",
];
// real
// const PROTECTED_PATHS = ["/feed", "/profile", "/chat"];
// test
const PROTECTED_PATHS = ["/void"];

// Combine all valid paths
const ALL_VALID_PATHS = [...PUBLIC_PATHS, ...PROTECTED_PATHS, ...ADMIN_PATHS];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("Authorization")?.value;

  // ดึง role จาก token
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
      userRole = payload.role;
    } catch (err) {
      console.error("Invalid Token");
    }
  }

  // const isPublicPath = PUBLIC_PATHS.includes(path); // เดี๋ยวแก้กลับ
  const isPublicPath = PUBLIC_PATHS.some(
    (PublicPath) => path.startsWith(`${PublicPath}/`) || path === PublicPath
  ); // เดี๋ยวมาลบ
  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) =>
      path.startsWith(`${protectedPath}/`) || path === protectedPath
  );
  const isAdminPath = ADMIN_PATHS.some((adminPath) =>
    path.startsWith(adminPath)
  );

  // Check if the path is valid (either exactly matches or is a sub-path of valid paths)
  const isValidPath = ALL_VALID_PATHS.some(
    (validPath) => path === validPath || path.startsWith(`${validPath}/`)
  );

  console.log(`🔍 Middleware triggered for path: ${path}`);
  console.log(`   - Token: ${token ? "Yes" : "No"}`);
  console.log(`   - User Role: ${userRole || "None"}`);
  console.log(`   - isPublicPath: ${isPublicPath}`);
  console.log(`   - isProtectedPath: ${isProtectedPath}`);
  console.log(`   - isAdminPath: ${isAdminPath}`);
  console.log(`   - isValidPath: ${isValidPath}`);

  // Handle invalid paths by letting Next.js handle the 404
  if (!isValidPath) {
    return NextResponse.next();
  }

  // Handle authentication and authorization for valid paths
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
