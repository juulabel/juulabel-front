import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";
import { IAlcoholTypeData } from "@/_types/search/alcoholTypeData";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AlcohoTypeDataThumbnail({
  id,
  name,
  thumbnail,
  breweryName,
  averageRating,
}: IAlcoholTypeData) {
  const router = useRouter();

  return (
    <div className="mb-[5%] flex w-full cursor-pointer flex-col">
      <div className="relative mb-2 aspect-[3/4] w-full grow overflow-hidden rounded-lg">
        <Image
          src={
            // thumbnail ??
            `/images/placeholders/alcohols/${placeholderThumbnailProvider("탁주")}.png`
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
          {breweryName}
        </p>
      </div>
    </div>
  );
}
