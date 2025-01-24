import { INoteThumbnail } from "@/_types/share";
import { dateViewKoreanFull } from "@/_utils/time";
import Image from "next/image";
import Link from "next/link";
import Caption from "./Caption";

export const placeholderThumbnailProvider = (alcoholType: string) => {
  switch (alcoholType) {
    case "소주":
    case "증류주":
      return "소주&증류주";
    case "탁주":
    case "약청주":
    case "과실주":
    case "기타주류":
      return alcoholType;
    default:
      return "기타주류";
  }
};

export default function NoteThumbnail({
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
    <div className="flex h-full w-full flex-col">
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg">
        <Caption type="primary" className="absolute left-2 top-2 z-10">
          {alcoholTypeName}
        </Caption>
        {hasMultipleImages && (
          <Image
            className="absolute right-2 top-2 z-10"
            src="/images/icons/pictures.png"
            alt="복수 이미지 아이콘"
            width={24}
            height={24}
          />
        )}
        {hasMultipleImages && (
          <Image
            className="absolute right-9 top-2 z-10"
            src="/svg/lock.svg"
            alt="복수 이미지 아이콘"
            width={24}
            height={24}
          />
        )}
        <Link href={`/share/note/${TastingNoteId}`}>
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
        </Link>
      </div>
      <div className="mb-0.5 font-medium text-cool-grayscale-800">
        {alcoholicDrinksName}
      </div>
      <div className="mb-1 flex items-center space-x-2">
        <Link
          href={`/user/profile/${memberId}`}
          className="relative h-6 w-6 overflow-hidden rounded-full"
        >
          <Image
            src={
              profileImage ?? `/images/placeholders/profile/default_profile.png`
            }
            alt="작성자 이미지"
            sizes="10vw"
            fill
            className="object-cover"
          />
        </Link>

        <div className="text-xs font-medium text-cool-grayscale-500">
          {nickname}
        </div>
      </div>
      <div className="text-xs text-cool-grayscale-500">
        {dateViewKoreanFull(createdAt)}
      </div>
    </div>
  );
}
