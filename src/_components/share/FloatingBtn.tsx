"use client";
import { cn } from "@/utils/commons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FloatingBtn() {
  const [clicked, setClicked] = useState<boolean>(false);
  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 h-full w-full transition duration-200 ease-out",
          clicked && "pointer-events-auto bg-black bg-opacity-60",
        )}
        onClick={() => setClicked((prev) => !prev)}
      />

      {/* floating button */}
      <div className="pointer-events-none sticky bottom-20 right-0 z-20 flex flex-col items-end justify-end space-y-4 border-white px-4">
        <div
          className={cn(
            "pointer-events-auto h-24 w-[143px] rounded-lg border bg-white opacity-0 transition-opacity duration-200 ease-out",
            clicked && "opacity-100",
          )}
        >
          <Link href="#" className="flex h-1/2 items-center justify-center">
            <Image
              src="/icons/addingBtn/tasting.png"
              alt="시음노트 작성 아이콘"
              width={24}
              height={24}
            />
            <div className="text-grayscale-800 ml-1 font-medium">
              시음노트 작성
            </div>
          </Link>
          <Link href="#" className="flex h-1/2 items-center justify-center">
            <Image
              src="/icons/addingBtn/dailyfeed.png"
              alt="일상생활 작성 아이콘"
              width={24}
              height={24}
            />
            <div className="text-grayscale-800 ml-1 font-medium">
              일상생활 작성
            </div>
          </Link>
        </div>
        <button
          className={cn(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-700 shadow transition duration-200 ease-out",
            clicked && "bg-white",
          )}
          onClick={() => setClicked((prev) => !prev)}
        >
          <Image
            src={`/icons/addingBtn/${clicked ? "cancel" : "add"}.png`}
            alt="글 추가 아이콘"
            width={clicked ? 34 : 24}
            height={clicked ? 34 : 24}
          />
        </button>
      </div>
    </>
  );
}
