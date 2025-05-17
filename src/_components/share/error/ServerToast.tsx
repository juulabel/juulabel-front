"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

interface Props {
  text: string;
  redirectPath: string;
  cookieDelete?: boolean;
}

export default function ServerToast({
  text,
  redirectPath,
  cookieDelete,
}: Props) {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  useEffect(() => {
    if (cookies.accessToken && cookieDelete) {
      removeCookie("accessToken", { path: "/" });
    }
    toast(text);
    router.push(redirectPath);
  }, [text, redirectPath]);

  return null;
}
