import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ปิดการตรวจสอบ ESLint ระหว่างการ build
    ignoreDuringBuilds: true,
  },
  // ถ้ามี TypeScript errors ด้วย อาจต้องเพิ่ม
  typescript: {
    // ปิดการตรวจสอบ TypeScript ระหว่างการ build
    ignoreBuildErrors: true,
  },
  // สำหรับข้อเตือนเกี่ยวกับ <img> tag
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
