"use client";

import { useRegisterStore } from "@/_store/register";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { setEmail, setProvider, setProviderId } = useRegisterStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const authCode = searchParams.get("code");
    if (authCode) {
      setIsLoading(true);
      const loginHandler = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/login/kakao`,
            {
              code: authCode,
              provider: "KAKAO",
              redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
            },
          );
          if (response.status === 200) {
            const data = response.data;
            if (data.result.isNewMember) {
              setEmail(data.result.o_auth_user_info.email);
              setProvider(data.result.o_auth_user_info.provider);
              setProviderId(data.result.o_auth_user_info.provider_id);
              localStorage.setItem("recentLogin", "kakao");
              router.push("/register/agreement");
            } else {
              setEmail(data.result.o_auth_user_info.email);
              setProvider(data.result.o_auth_user_info.provider);
              setProviderId(data.result.o_auth_user_info.provider_id);
              localStorage.setItem("recentLogin", "kakao");
              router.push("/register/agreement");
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      loginHandler();
    }
  }, [searchParams, setEmail, setProviderId, setProvider, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>카카오 소셜 로그인 인가 코드 테스트</div>;
}
