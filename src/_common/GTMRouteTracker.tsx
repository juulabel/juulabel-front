"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GTMRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams.toString()}`;
    window.dataLayer?.push({
      event: "pageview",
      page: url,
    });
  }, [pathname, searchParams]);

  return null;
}
