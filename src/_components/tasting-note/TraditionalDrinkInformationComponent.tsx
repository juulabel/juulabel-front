"use client";

import Image from "next/image";
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
        onClick={() => router.push("/share/note/write")}
      >
        <Image
          width={16}
          height={16}
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/add_icon.svg`}
          className="mr-[3px]"
          alt="추가 버튼"
        />
        <p className="text-sm font-bold text-white">
          직접 전통주 정보 입력하기
        </p>
      </div>
    </div>
  );
}
