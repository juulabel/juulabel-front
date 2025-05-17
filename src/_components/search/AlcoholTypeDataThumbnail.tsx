import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { placeholderThumbnailProvider } from "@/_components/tasting-note/NoteThumbnail";
import { IAlcoholTypeData } from "@/_types/search/alcoholTypeData";

export default function AlcoholTypeDataThumbnail({
  id,
  name,
  thumbnail,
  breweryName,
  averageRating,
}: IAlcoholTypeData) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Link
      className="mb-[5%] flex w-full cursor-pointer flex-col"
      href={`/share/liquor/${id}`}
    >
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 z-10 animate-[pulse_1.5s_ease-in-out_infinite] animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%]" />
        )}

        <img
          src={thumbnail}
          alt="전통주 썸네일"
          sizes="50vw"
          className="absolute inset-0 h-full w-full object-cover"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className={`mb-[1%] text-base font-medium text-cool-grayscale-800`}>
        {name}
      </div>
      <div className="flex flex-row items-center">
        <Image
          width={16}
          height={16}
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/pin_icon.svg`}
          alt="위치 아이콘"
          className="mr-[1%]"
          loading="lazy"
        />
        <p className="text-sm font-normal text-cool-grayscale-500">
          {breweryName}
        </p>
      </div>
    </Link>
  );
}
