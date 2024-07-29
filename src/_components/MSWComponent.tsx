"use client";

import { useEffect } from "react";
//MSW가 v2로 업그레이드 되면서 if(typeof window !== "undefined")로 감싸주게 변경
//window!== undefined이면 window가 존재 == 클라이언트 환경 == 브라우저

interface MSWComponentProps {
  children: React.ReactNode;
}

async function startClientMSW() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const worker = await import("@/mocks/browser").then((res) => res.default);
    worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

export const MSWComponent = ({ children }: MSWComponentProps) => {
  useEffect(() => {
    startClientMSW();
  }, []);

  return <>{children}</>;
};
