"use client";

import { useRouter } from "next/navigation";

export default function AlcoholTypeLoader() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-row items-center">
        <p className="px-1 text-base font-normal text-cool-grayscale-500">
          찾으시는
        </p>
        <p className="text-base font-normal text-[#ff823b]">전통주가</p>
        <p className="px-1 text-base font-normal text-cool-grayscale-600">
          없으신가요?
        </p>
      </div>
      <div
        className="mt-4 flex h-[37px] cursor-pointer items-center justify-center rounded-[4px] bg-black px-3 py-2"
        onClick={() => router.push("/share/note/write")}
      >
        <p className="text-sm font-bold text-white">
          직접 전통주 정보 입력하기
        </p>
      </div>
    </>
  );
}
