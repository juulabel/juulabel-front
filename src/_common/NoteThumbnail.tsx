import Image from "next/image";
import Caption from "./Caption";
import { INoteThumbnail } from "@/_types/share";
import Link from "next/link";
import { dateViewKoreanFull } from "@/_utils/time";

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
  memberInfo: {memberId, nickname, profileImage},
  thumbnailPath,
  alcoholTypeName,
  createdAt,
  hasMultipleImages,  
}: INoteThumbnail) {
  return (
    <Link href={`/share/notes/${TastingNoteId}`} className="flex w-full flex-col">
      <div className="relative mb-2 aspect-[3/4] w-full grow overflow-hidden rounded-lg">
        <Caption type="primary" className="absolute left-2 top-2 z-10">
          {alcoholTypeName}
        </Caption>
        {hasMultipleImages && (
          <Image
            className="absolute right-2 top-2 z-10"
            src="/icons/pictures.png"
            alt="복수 이미지 아이콘"
            width={24}
            height={24}
          />
        )}
        <Image
          src={
            // thumbnailPath ??
            `/placeholders/alcohols/${placeholderThumbnailProvider(alcoholTypeName)}.png`
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
            src={profileImage ?? `/placeholders/profile/default_profile.png`}
            alt="작성자 이미지"
            sizes="10vw"
            fill
            className="object-cover"
          />
        </div>

        <div className="text-xs font-medium text-cool-grayscale-500">
          {nickname}
        </div>
      </div>
      <div className="text-xs text-cool-grayscale-500">{dateViewKoreanFull(createdAt)}</div>
    </Link>
  );
}
