"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterStore } from "@/_store/register";
import { Suspense, useEffect } from "react";
import requests from "@/app/api/requests";
import Loading from "@/_common/Loading";
import axios from "@/app/api/axios";

function KakaoLoginHandlerComponent() {
  const { setEmail, setProvider, setProviderId } = useRegisterStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const authCode = searchParams.get("code");
    if (authCode) {
      const loginHandler = async () => {
        try {
          const response = await axios.post(requests.postKakaoLogin, {
            code: authCode,
            provider: "KAKAO",
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
          });
          if (response.status === 200) {
            const data = response.data.result.oAuthUserInfo;
            setEmail(data.email);
            setProvider(data.provider);
            setProviderId(data.providerId);
            localStorage.setItem("recentLogin", "kakao");
            if (response.data.result.isNewMember) {
              router.push("/register/agreement");
            } else {
              router.push("/register/agreement"); //추후 수정 예정
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      loginHandler();
    }
  }, []);

  return <div>카카오 소셜 로그인</div>;
}
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <KakaoLoginHandlerComponent />
    </Suspense>
  );
}
