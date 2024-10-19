"use client";
import { cn } from "@/_utils/commons";
import Image from "next/image";

export default function ScrollUpFloatingBtn() {
  return (
    <>
      {/* floating button */}
      <div className="pointer-events-none fixed bottom-12 z-20 flex w-full max-w-[560px] flex-col items-end justify-end space-y-4 border-white px-4">
        <button
          className={cn(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow",
          )}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
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
