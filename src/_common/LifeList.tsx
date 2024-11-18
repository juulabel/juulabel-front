import { ILifeList } from "@/_types/share";
import { dateView } from "@/_utils/time";
import Image from "next/image";
import Link from "next/link";

export default function LifeList({
  title,
  content,
  dailyLifeId,
  memberInfo: { nickname, profileImage },
  thumbnailPath,
  imageCount,
  createdAt,
  likeCount,
  commentCount,
  isLiked,
}: ILifeList) {
  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  return (
    <Link href={`/share/life/${dailyLifeId}`} className="block px-4 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="mb-1 font-medium text-cool-grayscale-800">
            {title}
          </div>
          <div className="mb-4 line-clamp-2 text-ellipsis text-sm text-cool-grayscale-700">
            {content}
          </div>
        </div>

        {thumbnailPath && (
          <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg">
            {imageCount && imageCount > 1 && (
              <div className="absolute left-0 top-0 z-10 bg-black bg-opacity-60 px-2 py-0.5 text-sm text-white">
                {imageCount}
              </div>
            )}
            <Image
              src={
                thumbnailPath && isValidUrl(thumbnailPath)
                  ? thumbnailPath
                  : "/images/placeholders/life/default_life_thumbnail.png"
              }
              alt="일상생활 썸네일 이미지"
              sizes="30vw"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-cool-grayscale-600">
        <div className="flex items-center space-x-1">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={
                profileImage && isValidUrl(profileImage)
                  ? profileImage
                  : "/images/placeholders/profile/default_profile.png"
              }
              alt="작성자 이미지"
              sizes="10vw"
              fill
              className="object-cover"
            />
          </div>

          <div>{nickname}</div>
          <div className="text-cool-grayscale-400">&#183;</div>
          <div>{dateView(createdAt)}</div>
        </div>
        <div className="flex items-center">
          <Image
            src="/svg/like.svg"
            alt="좋아요 아이콘"
            className="mr-0.5"
            width={14}
            height={14}
          />
          <div className="mr-1.5">{likeCount}</div>
          <Image
            src="/images/icons/comment.png"
            alt="댓글 아이콘"
            className="mr-0.5"
            width={18}
            height={18}
          />
          <div>{commentCount}</div>
        </div>
      </div>
      <hr className="mt-5 bg-cool-grayscale-100" />
    </Link>
  );
}
