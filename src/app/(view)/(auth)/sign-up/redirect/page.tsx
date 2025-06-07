"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import LoginLoading from "@/_components/auth/login/LoginLoading";
import { useRegisterStore } from "@/_store/register";

function RegisterHandlerComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setEmail } = useRegisterStore();

  useEffect(() => {
    const email = searchParams.get("email");
    setEmail(email ?? "");
    router.replace("/sign-up");
  }, []);

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <RegisterHandlerComponent />
    </Suspense>
  );
}
