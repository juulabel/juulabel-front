"use client";

import Caption from "@/_common/Caption";
import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";
import { IOfficialData } from "@/_types/tasting-note/officialData";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OfficialDataThumbnail({
  name,
  alcoholContent,
  alcoholType,
  thumbnail,
  brewery,
}: IOfficialData) {
  const router = useRouter();

  const handleClick = () => {
    router.push(
      `/note/write?productName=${encodeURIComponent(
        name,
      )}&alcoholContent=${encodeURIComponent(
        alcoholContent,
      )}&alcoholType=${encodeURIComponent(
        alcoholType.name,
      )}&brewery=${brewery ? encodeURIComponent(brewery.name) : ""}&breweryLocation=${
        brewery.region ? encodeURIComponent(brewery.region) : ""
      }`,
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
        <Image
          src={
            // thumbnail ??
            `/images/placeholders/alcohols/${placeholderThumbnailProvider(alcoholType.name)}.png`
          }
          alt="시음노트 썸네일"
          fill
          className="object-cover"
        />
      </div>
      <div className="mb-[1%] text-base font-medium text-cool-grayscale-800">
        {name}
      </div>
      <div className="flex flex-row items-center">
        <Image
          width={16}
          height={16}
          src="/svg/pin_icon.svg"
          alt="위치 아이콘"
          className="mr-[1%]"
        />
        <p className="text-sm font-normal text-cool-grayscale-500">
          {brewery.name}
        </p>
      </div>
    </div>
  );
}
