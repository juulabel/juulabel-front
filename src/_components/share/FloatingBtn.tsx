"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/_utils/commons";

export default function FloatingBtn() {
  const [clicked, setClicked] = useState<boolean>(false);
  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          "pointer-events-none fixed top-0 z-20 h-full w-full max-w-[560px] transition duration-200 ease-out",
          clicked && "pointer-events-auto bg-black bg-opacity-60",
        )}
        onClick={() => setClicked((prev) => !prev)}
      />

      {/* floating button */}
      <div className="pointer-events-none fixed bottom-20 z-20 flex w-full max-w-[560px] flex-col items-end justify-end space-y-4 border-white px-4">
        <div
          className={cn(
            "pointer-events-auto h-24 w-[143px] rounded-lg border bg-white opacity-0 transition-opacity duration-200 ease-out",
            clicked && "opacity-100",
            !clicked && "pointer-events-none",
          )}
        >
          <Link
            href={clicked ? "/share/note/search" : "#"}
            className={cn(
              "flex h-1/2 items-center justify-center",
              !clicked && "cursor-not-allowed",
            )}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/addingBtn/tasting.png`}
              alt="시음노트 작성 아이콘"
              width={24}
              height={24}
            />
            <div className="text-grayscale-800 ml-1 font-medium">
              시음노트 작성
            </div>
          </Link>
          <Link
            href={clicked ? "/share/life/write" : "#"}
            className={cn(
              "flex h-1/2 items-center justify-center",
              !clicked && "cursor-not-allowed",
            )}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/addingBtn/dailyfeed.png`}
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
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/addingBtn/${clicked ? "cancel" : "add"}.png`}
            alt="글 추가 아이콘"
            width={clicked ? 34 : 24}
            height={clicked ? 34 : 24}
          />
        </button>
      </div>
    </>
  );
}
