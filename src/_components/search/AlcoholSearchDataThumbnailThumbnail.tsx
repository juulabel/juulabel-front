"use client";

import Caption from "@/_common/Caption";
import { placeholderThumbnailProvider } from "@/_components/tasting-note/NoteThumbnail";
import { IAlcoholSearchData } from "@/_types/search/alcoholSearchData";
import { cn } from "@/_utils/commons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AlcoholSearchDataThumbnail({
  id: alcoholicDrinksId,
  name,
  alcoholType,
  thumbnail,
  alcoholContent,
  brewery,
}: IAlcoholSearchData) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const handleClick = () => {
    router.push(
      `/share/liquor/${alcoholicDrinksId}`,
      // `/share/note/write?alcoholicDrinksId=${alcoholicDrinksId}&productName=${encodeURIComponent(
      //   name,
      // )}&alcoholContent=${encodeURIComponent(
      //   alcoholContent,
      // )}&alcoholTypeId=${encodeURIComponent(
      //   alcoholType.id,
      // )}&alcoholTypeName=${encodeURIComponent(
      //   alcoholType.name,
      // )}&brewery=${brewery ? encodeURIComponent(brewery.name) : ""}&breweryLocation=${
      //   brewery ? encodeURIComponent(brewery.region) : ""
      // }`,
    );
  };
  return (
    <div
      className="mb-[5%] flex w-full cursor-pointer flex-col"
      onClick={handleClick}
    >
      <div className="relative mb-2 aspect-[3/4] w-full grow overflow-hidden rounded-lg">
        <Caption type="primary" className="absolute left-2 top-2 z-10">
          {alcoholType.name}
        </Caption>
        {isLoading && (
          <div className="absolute inset-0 z-10 animate-[pulse_1.5s_ease-in-out_infinite] animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%]" />
        )}
        <div className="relative h-full w-full">
          <img
            src={
              thumbnail
                ? thumbnail
                : `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/alcohols/${placeholderThumbnailProvider(
                    alcoholType.name,
                  )}.png`
            }
            alt="시음노트 썸네일"
            sizes="50vw"
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
      <div className="mb-[1%] text-base font-medium text-cool-grayscale-800">
        {name}
      </div>
      <div className="mb-[2%] flex flex-row items-center">
        <Image
          width={16}
          height={16}
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/pin_icon.svg`}
          alt="위치 아이콘"
          className="mr-[1%]"
        />
        <p className="text-sm font-normal text-cool-grayscale-500">
          {brewery.name}
        </p>
      </div>
      <div className="flex flex-row items-center gap-1">
        <Image
          width={16}
          height={16}
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}${
            alcoholContent == 0
              ? "/svg/gray_moon_score_icon.svg"
              : "/svg/moon_score_icon.svg"
          }`}
          alt="위치 아이콘"
          className="mr-[1%]"
        />
        <p
          className={cn(
            "text-sm font-normal",
            alcoholContent == 0 ? "text-slate-400" : "text-slate-800",
          )}
        >
          {alcoholContent}
        </p>
      </div>
    </div>
  );
}
