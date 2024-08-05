import { ILifeDetail } from "@/_types/share";
import { dateView } from "@/_utils/time";
import Image from "next/image";

export default function LifeViewer({
  title,
  content,
  postId,
  username,
  userImage,
  contentImages,
  contentImageCount,
  published,
  likeCount,
  commentCount,
}: ILifeDetail) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-1">
        <div className="flex space-x-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={userImage}
              alt="작성자 이미지"
              sizes="10vw"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-cool-grayscale-700">{username}</div>
        </div>
        <div className="text-cool-grayscale-500">{dateView(published)}</div>
      </div>
      <div className="">{/* <Image /> */}</div>
      <div className="text-2xl font-bold text-cool-grayscale-800">{title}</div>
      <hr className="mb-4 mt-5 h-1 border-none bg-cool-grayscale-50" />
      <p className="text-wrap text-cool-grayscale-700">{content}</p>
    </div>
  );
}
