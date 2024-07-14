"use client";

import TopHeader from "@/_common/TopHeader";
import LoginButton from "@/_components/LoginButton";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const handleKakaoLogin = () => {
    console.log("카카오");
    router.push("/register/agreement");
  };
  const handleGoogleLogin = () => {
    console.log("구글");
    router.push("/register/agreement");
  };
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
