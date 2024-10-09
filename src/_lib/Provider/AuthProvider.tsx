"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const isMockingMode = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    const checkCookieExpiration = () => {
      if (pathname.startsWith("/share")) {
        if (!cookies.accessToken) {
          router.push("/"); // Redirect to login if cookie is expired or missing
        }
      }
    };

    checkCookieExpiration();

    // Optionally, you could set an interval to check periodically
    const interval = setInterval(checkCookieExpiration, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [pathname, cookies, router]);

  return <>{children}</>;
};
