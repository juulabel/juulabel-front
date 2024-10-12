"use client";
import Image from "next/image";

export default function CommentsHeader() {
  return (
    <div className="sticky top-0 z-10 flex h-[64px] w-full flex-row items-center justify-center gap-2 border-b border-gray-300 bg-white px-3">
      <div className="text-[18px] font-bold text-cool-grayscale-700">댓글</div>
      <div className="text-[16px] font-normal text-cool-grayscale-500">
        18개
      </div>
      <Image
        className="absolute right-4"
        src={"/svg/close_icon.svg"}
        width={32}
        height={32}
        alt="cancel"
      />
    </div>
  );
}
