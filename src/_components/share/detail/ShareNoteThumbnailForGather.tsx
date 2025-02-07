import Link from "next/link";
import Image from "next/image";
import Caption from "@/_common/Caption";
import { INoteThumbnail } from "@/_types/share";
import { dateViewKoreanFull } from "@/_utils/time";
import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";

export default function ShareNoteThumbnailForGather({
  TastingNoteId,
  alcoholicDrinksName,
  memberInfo: { memberId, nickname, profileImage },
  thumbnailPath,
  alcoholTypeName,
  createdAt,
  hasMultipleImages,
  isPrivate,
}: INoteThumbnail) {
  return (
    <Link
      href={`/share/note/${TastingNoteId}`}
      className="flex w-full flex-col"
    >
      <div className="relative mb-2 aspect-[3/4] w-full grow overflow-hidden rounded-lg">
        <Caption type="primary" className="absolute left-2 top-2 z-10">
          {alcoholTypeName}
        </Caption>
        {hasMultipleImages && (
          <Image
            className="absolute right-2 top-2 z-10"
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/pictures.png`}
            alt="복수 이미지 아이콘"
            width={24}
            height={24}
          />
        )}
        {hasMultipleImages && (
          <Image
            className="absolute right-9 top-2 z-10"
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/lock.svg`}
            alt="복수 이미지 아이콘"
            width={24}
            height={24}
          />
        )}
        <Image
          src={
            thumbnailPath ??
            `/images/placeholders/alcohols/${placeholderThumbnailProvider(alcoholTypeName)}.png`
          }
          alt="시음노트 썸네일"
          sizes="50vw"
          fill
          className="object-cover"
        />
      </div>
      <div className="mb-0.5 font-medium text-cool-grayscale-800">
        {alcoholicDrinksName}
      </div>
      <div className="mb-1 flex items-center space-x-2">
        <div className="relative h-6 w-6 overflow-hidden rounded-full">
          <Image
            src={
              profileImage ??
              `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`
            }
            alt="작성자 이미지"
            sizes="10vw"
            fill
            className="object-cover"
          />
        </div>

        <div className="text-nowrap text-xs font-medium text-cool-grayscale-500">
          {nickname}
        </div>
      </div>
      <div className="texst-cool-grayscale-500 flex flex-row items-center text-xs">
        {dateViewKoreanFull(createdAt)}
        {/* 달점인데 현재 기획에서 제외됨
        <Image*/}
        {/*  src={"/svg/moon_rating_icon_mini.svg"}*/}
        {/*  alt={"c"}*/}
        {/*  width={16}*/}
        {/*  height={16}*/}
        {/*/>*/}

        {/*<span>4.3</span>*/}
      </div>
    </Link>
  );
}
