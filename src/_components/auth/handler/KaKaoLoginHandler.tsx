"use client";

import { useRegisterStore } from "@/_store/register";
import { instance } from "@/app/api/axios";
import requests from "@/app/api/requests";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import LoginLoading from "./LoginLoading";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

export default function KaKaoLoginHandler() {
  const { setEmail, setProvider, setProviderId } = useRegisterStore();

  const searchParams = useSearchParams();

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const authCode = searchParams.get("code");
  const router = useRouter();

  useEffect(() => {
    if (authCode) {
      const loginHandler = async () => {
        try {
          const response = await instance.post(requests.postKakaoLogin, {
            code: authCode,
            provider: "KAKAO",
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
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
          if (isAxiosError(error) && error.response?.status === 400) {
            toast("탈퇴한 회원입니다.");
          } else {
            //  terminal 에서 확인 필요            
            toast("비정상 접근입니다.");
          }
          router.push("/");
        }
      };
      loginHandler();
    }
  }, [authCode]);

  return <LoginLoading />;
}
