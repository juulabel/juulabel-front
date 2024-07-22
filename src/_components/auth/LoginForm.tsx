"use client";

import TopHeader from "@/_common/TopHeader";
import LoginButton from "@/_components/auth/LoginButton";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const kakaoSocialLoginLink = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI}&response_type=code`;
  const googleSocialLoginLink = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&scope=email&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URI}`;
  const [kakaoRecentLogin, setKakaoRecentLogin] = useState<boolean>(false);
  const [googleRecentLogin, setGoogleRecentLogin] = useState<boolean>(false);

  const handleKakaoLogin = () => {
    window.location.href = kakaoSocialLoginLink;
  };

  const handleGoogleLogin = () => {
    window.location.href = googleSocialLoginLink;
  };

  useEffect(() => {
    if (localStorage.getItem("recentLogin") === "kakao")
      setKakaoRecentLogin(true);
    else if (localStorage.getItem("recentLogin") === "google")
      setGoogleRecentLogin(true);
  }, []);

  return (
    <div className="w-[393px]">
      <TopHeader backUrl="" title="로그인" step={0} rest={0} />
      <div className="mb-[60px] mt-[136px] flex flex-col items-center justify-center">
        <Image
          width={228}
          height={112}
          src="/images/main_logo.png"
          alt="주라벨 메인로고"
        />
        <h2 className="mt-4 text-xl font-bold text-primary-700">
          주라벨에 오신 것을 환영해요!
        </h2>
      </div>
      <LoginButton buttonType="kakao" handleButton={handleKakaoLogin}>
        {kakaoRecentLogin && (
          <div className="absolute bottom-9 right-[280px]">
            <Image
              width={71}
              height={31}
              src="/images/tool-tip.png"
              alt="최근 로그인"
            />
          </div>
        )}

        <Image
          width={24}
          height={24}
          src="/images/kakao_icon.png"
          alt="카카오 소셜 로그인 버튼"
        />
        <p className="ml-1 text-base font-medium">카카오로 시작하기</p>
      </LoginButton>

      <div className="mb-4" />

      <LoginButton buttonType="google" handleButton={handleGoogleLogin}>
        <div className="absolute bottom-9 right-[280px]">
          {googleRecentLogin && (
            <Image
              width={71}
              height={31}
              src="/images/tool-tip.png"
              alt="최근 로그인"
            />
          )}
        </div>
        <Image
          width={20}
          height={20}
          src="/images/google_icon.png"
          alt="구글 소셜 로그인 버튼"
        />
        <p className="ml-1 text-base font-medium">구글로 시작하기</p>
      </LoginButton>
    </div>
  );
}
