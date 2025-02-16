import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";
import { IAlcoholTypeData } from "@/_types/search/alcoholTypeData";
import Image from "next/image";
import Link from "next/link";
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
    <Link
      className="mb-[5%] flex w-full cursor-pointer flex-col"
      href={`/share/liquor/${id}`}
    >
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg">
        <Image
          src={thumbnail}
          alt="전통주 썸네일"
          sizes="50vw"
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
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/pin_icon.svg`}
          alt="위치 아이콘"
          className="mr-[1%]"
        />
        <p className="text-sm font-normal text-cool-grayscale-500">
          {breweryName}
        </p>
      </div>
    </Link>
  );
}
