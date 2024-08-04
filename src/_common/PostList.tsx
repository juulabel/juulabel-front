import { IPostList } from "@/_types/share";
import { dateView } from "@/_utils/time";
import Image from "next/image";
import Link from "next/link";

export default function PostList({
  title,
  content,
  postId,
  username,
  userImage,
  contentThumbnail,
  contentImageCount,
  published,
  likeCount,
  commentCount,
}: IPostList) {
  return (
    <Link href={`/share/life/${postId}`} className="block px-4 pt-5">
      <div className="flex items-center gap-4">
        <div>
          <div className="mb-1 font-medium text-cool-grayscale-800">
            {title}
          </div>
          <div className="mb-4 line-clamp-2 text-ellipsis text-sm text-cool-grayscale-700">
            {content}
          </div>
        </div>

        {contentThumbnail && (
          <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg">
            {contentImageCount && contentImageCount > 1 && (
              <div className="absolute left-0 top-0 z-10 bg-black bg-opacity-60 px-2 py-0.5 text-sm text-white">
                {contentImageCount}
              </div>
            )}
            <Image
              src={contentThumbnail}
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
              src={userImage}
              alt="작성자 이미지"
              sizes="10vw"
              fill
              className="object-cover"
            />
          </div>

          <div>{username}</div>
          <div className="text-cool-grayscale-400">&#183;</div>
          <div>{dateView(published)}</div>
        </div>
        <div className="flex items-center">
          <Image
            src="/icons/like.png"
            alt="좋아요 아이콘"
            width={16}
            height={16}
          />
          <div className="mr-1">{likeCount}</div>
          <Image
            src="/icons/comment.png"
            alt="댓글 아이콘"
            width={16}
            height={16}
          />
          <div>{commentCount}</div>
        </div>
      </div>
      <hr className="mt-5 bg-cool-grayscale-100" />
    </Link>
  );
}
