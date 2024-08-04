"use client";

import { useRouter } from "next/navigation";

export default function TraditionalDrinkInformationComponent() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-sm font-normal text-cool-grayscale-500">
        찾으시는 전통주 정보가 나오지 않는다면,
      </p>
      <p className="text-base font-bold text-cool-grayscale-800">
        직접 전통주 정보를 입력할 수 있어요.
      </p>
      <div
        className="mt-4 flex h-[37px] cursor-pointer items-center justify-center rounded-[4px] bg-black px-3 py-2"
        onClick={() => router.push("/tasting-note/write")}
      >
        <img
          src="/svg/add_icon.svg"
          className="mr-[3px] h-4 w-4"
          alt="추가 버튼"
        />
        <p className="text-sm font-bold text-white">
          직접 전통주 정보 입력하기
        </p>
      </div>
    </div>
  );
}
