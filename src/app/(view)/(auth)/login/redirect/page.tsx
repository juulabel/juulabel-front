"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import LoginLoading from "@/_components/auth/login/LoginLoading";

function LoginHandlerComponent() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/share/note");
  }, []);

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginHandlerComponent />
    </Suspense>
  );
}
