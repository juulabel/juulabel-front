"use client";

import { useEffect, useState } from "react";

const isMockingMode = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export const MSWComponent = ({ children }: { children: React.ReactNode }) => {
  const [mswReady, setMswReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      if (isMockingMode) {
        const initMsw = await import("@/mocks/index").then(
          (res) => res.initMsw,
        );
        await initMsw();
        setMswReady(true);
      }
    };

    if (!mswReady) {
      init();
    }
  }, [mswReady]);

  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
};
