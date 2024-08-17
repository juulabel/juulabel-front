"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterStore } from "@/_store/register";
import { Suspense, useEffect } from "react";
import requests from "@/app/api/requests";
import Loading from "@/_common/Loading";
import axios from "@/app/api/axios";
import { useCookies } from "react-cookie";

function KakaoLoginHandlerComponent() {
  const { setEmail, setProvider, setProviderId } = useRegisterStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

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
              setCookie("accessToken", response.data.result.token.accessToken, {
                path: "/",
                expires: new Date(response.data.result.token.accessExpiredAt),
              });
              router.push("/share/notes"); //추후 수정 예정
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
