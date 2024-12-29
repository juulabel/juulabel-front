"use client";
import { cn } from "@/_utils/commons";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  layoutId?: string;
}

export default function ScrollUpFloatingBtn({ layoutId }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = layoutId
        ? document.getElementById(layoutId)?.scrollTop || 0
        : window.scrollY;

      setIsVisible(scrollY > 100);
    };

    if (layoutId) {
      const container = document.getElementById(layoutId);
      container?.addEventListener("scroll", handleScroll);
      return () => container?.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [layoutId]);

  if (!isVisible) return null;
  return (
    <>
      {/* floating button */}
      <div className="pointer-events-none fixed bottom-12 z-20 flex w-full max-w-[560px] flex-col items-end justify-end space-y-4 border-white px-4">
        <button
          className={cn(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow",
          )}
          onClick={() => {
            if (layoutId) {
              document
                .getElementById(layoutId)
                ?.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/svg/up_arrow.svg"
            alt="글 추가 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>
    </>
  );
}
