import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          const { authenticated } = await checkAuth();
          if (!authenticated) {
            router.push("/login");
            // แสดงข้อความ redirect เพื่อให้ผู้ใช้ทราบ
            return;
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          router.push("/login");
        } finally {
          setIsLoading(false);
        }
      };

      verifyAuth();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Redirecting...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
