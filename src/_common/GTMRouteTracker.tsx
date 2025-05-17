"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
