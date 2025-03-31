import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// real
const PUBLIC_PATHS = ["/", "/explore", "/login", "/register"];

// real
const PROTECTED_PATHS = [
  "/feed",
  "/profile",
  "/chat",
  "/community",
  "/party",
  "/friends",
];

const ADMIN_PATHS = ["/admin"];

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

  // ตรวจสอบว่าเป็น public path หรือเริ่มต้นด้วย public path
  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // ตรวจสอบว่าเป็น protected path หรือเริ่มต้นด้วย protected path
  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  // ตรวจสอบว่าเป็น admin path หรือเริ่มต้นด้วย admin path
  const isAdminPath = ADMIN_PATHS.some(
    (adminPath) => path === adminPath || path.startsWith(`${adminPath}/`)
  );

  // ตรวจสอบว่า path ถูกต้อง (ตรงกับ valid path หรือเป็น sub-path ของ valid path)
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

  // ในโหมดทดสอบเพื่อให้เข้าถึงทุก path ได้ เราจะข้ามการตรวจสอบการเข้าถึง
  // และปล่อยให้ทุกคนเข้าถึงทุก path ได้

  // ถ้าไม่ใช่ valid path ให้ Next.js จัดการ 404
  if (!isValidPath) {
    return NextResponse.next();
  }

  // อนุญาตให้เข้าถึงทุก path ในโหมดทดสอบ
  // return NextResponse.next();

  // คอมเมนต์โค้ดด้านล่างไว้ชั่วคราวสำหรับการทดสอบ
  
  // Handle authentication and authorization for valid paths
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPath && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
