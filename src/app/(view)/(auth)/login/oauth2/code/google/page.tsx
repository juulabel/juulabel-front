"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterStore } from "@/_store/register";
import { Suspense, useEffect } from "react";
import requests from "@/app/api/requests";
import Loading from "@/_common/Loading";
import axios from "@/app/api/axios";

function GoogleLoginHandlerComponent() {
  const { setEmail, setProvider, setProviderId } = useRegisterStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const authCode = searchParams.get("code");
    if (authCode) {
      const loginHandler = async () => {
        try {
          const response = await axios.post(requests.postGoogleLogin, {
            code: authCode,
            provider: "GOOGLE",
            redirectUri: process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URI,
          });
          if (response.status === 200) {
            const data = response.data.result.oAuthUserInfo;
            setEmail(data.email);
            setProvider(data.provider);
            setProviderId(data.providerId);
            localStorage.setItem("recentLogin", "google");
            if (data.result.isNewMember) {
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
  return <div>구글 소셜 로그인</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <GoogleLoginHandlerComponent />
    </Suspense>
  );
}
