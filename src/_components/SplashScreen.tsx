"use client";

import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LoginForm from "./auth/LoginForm";
import { useCookies } from "react-cookie";
import Notes from "@/app/(view)/(main)/share/notes/page";

const isTokenExpired = (token: string): boolean => {
  const decoded: any = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds    
  return decoded.exp < currentTime;
};

export default function SplashScreen() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter(); // Initialize useRouter for programmatic navigation
  const [isLoading, setIsLoading] = useState<boolean>(isHome);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const accessToken = cookies.accessToken;
  const isExpired = useMemo(() => accessToken && isTokenExpired(accessToken), [accessToken]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (accessToken) {
      if (isExpired) {
        removeCookie("accessToken", { path: "/" });
      } else {
        router.push("/share/notes");
      }
    }
  }, [isLoading, accessToken, isExpired, removeCookie, router]);

  return (
    <>
      {isLoading && isHome ? (
        <div className="flex h-[100vh] w-full max-w-[560px] flex-col items-center justify-center bg-primary-700">
          <Image
            src="/images/main_logo2.png"
            width={226}
            height={148}
            alt="주라벨 메인 로고2"
          />
          <div className="mt-8 flex w-full flex-row justify-center text-xl text-white">
            <span>우리술,</span>
            <span className="mx-[1%] text-primary-100">우리에게</span>
            <span className="font-semibold">자부</span>
            <span className="text-emphasis" />
            <span className="mr-[1%] font-semibold">심이</span>
            <span className="text-primary-100">되도록</span>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
