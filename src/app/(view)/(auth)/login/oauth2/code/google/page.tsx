"use client";

import Loading from "@/_common/Loading";
import { useRegisterStore } from "@/_store/register";
import { instance } from "@/app/api/axios";
import requests from "@/app/api/requests";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCookies } from "react-cookie";

function GoogleLoginHandlerComponent() {
  const { setEmail, setProvider, setProviderId } = useRegisterStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  useEffect(() => {
    const authCode = searchParams.get("code");
    if (authCode) {
      const loginHandler = async () => {
        try {
          const response = await instance.post(requests.postGoogleLogin, {
            code: authCode,
            provider: "GOOGLE",
            redirectUri: process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URI,
          });
          if (response.status === 200) {
            const data = response.data.result.oAuthUserInfo;
            setEmail(data.email);
            setProvider(data.provider);
            setProviderId(data.providerId);            
            if (response.data.result.isNewMember) {
              router.push("/register/agreement");
            } else {
              setCookie("accessToken", response.data.result.token.accessToken, {
                path: "/",
                expires: new Date(response.data.result.token.accessExpiredAt),
              });
              router.push("/share/note"); //추후 수정 예정
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      loginHandler();
    }
  });
  return <div>구글 소셜 로그인</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <GoogleLoginHandlerComponent />
    </Suspense>
  );
}
