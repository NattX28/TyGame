import { Kanit } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Suspense } from "react";
import LoadingScreen from "@/components/loading/LoadingScreen";

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500"],
  subsets: ["thai"],
  variable: "--font-kanit",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.className} antialiased min-h-screen bg-main`}>
        <main className="text-main-color max-w-full mx-auto">
          {/* <Providers> */}
            <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
          {/* </Providers> */}
        </main>
      </body>
    </html>
  );
}
