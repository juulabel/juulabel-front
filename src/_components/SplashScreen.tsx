"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import LoginForm from "./auth/login/LoginForm";

export default function SplashScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    // Simulate splash screen timeout if on the home page
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Check for access token and handle redirection
    if (cookies.accessToken) {
      router.push("/share/note");
    } else {
      setIsCheckingAuth(false); // Done checking auth, can show the login form
    }
  }, [isLoading, cookies.accessToken, router]);

  // While loading or checking auth, show the splash screen
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex h-[100vh] w-full max-w-[560px] flex-col items-center justify-center bg-primary-700">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/main_logo2.png`}
          width={226}
          height={148}
          alt="주라벨 메인 로고2"
          priority
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
    );
  }

  // After loading and auth check, show the login form
  return <LoginForm />;
}
