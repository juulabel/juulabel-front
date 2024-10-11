"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  text: string;
  redirectPath: string;
}

export default function ServerToast({ text, redirectPath }: Props) {
  const router = useRouter();

  useEffect(() => {
    toast(text);
    router.push(redirectPath);
  }, [text, redirectPath]);

  return null;
}
