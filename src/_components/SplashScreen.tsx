"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./auth/LoginForm";
import TopHeader from "@/_common/TopHeader";
import RegisterAgreementForm from "./auth/RegisterAgreementForm";
import NicknameForm from "./auth/NicknameForm";
import { useQuery } from "@tanstack/react-query";
import { INoteThumbnail } from "@/_types/share";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
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

  const onPushNote = async () => {
    router.push("/share/notes");
  };

  // 임시 에러 및 로딩 컴포넌트

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
