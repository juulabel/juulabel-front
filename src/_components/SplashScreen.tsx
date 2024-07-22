"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./auth/LoginForm";

export default function SplashScreen() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState<boolean>(isHome);
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer); //컴포넌트가 언마운트될 때 타이머를 정리
    }
  }, [isLoading]);
  return (
    <>
      {isLoading && isHome ? (
        <div className="flex h-[100vh] w-[393px] flex-col items-center justify-center bg-primary-700">
          <Image
            src="/images/main_logo2.png"
            width={226}
            height={148}
            alt="주라벨 메인 로고2"
          />
          <div className="mt-8 flex flex-row text-xl text-white">
            <p>우리술,</p>
            <p className="mx-[2px] text-primary-100">우리에게</p>
            <p className="font-semibold">자부</p>
            <span className="text-emphasis" />
            <p className="mr-1 font-semibold">심이</p>
            <p className="text-primary-100">되도록</p>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
