import { dateViewKoreanFull } from "@/_utils/time";
import Image from "next/image";
import LifeCarousel from "./LifeCarousel";

interface ILifeViewer {
  title: string;
  content: string;
  nickname: string;
  profileImage: string | null;
  createdAt: string;
  imageUrlList: string[];
  imageCount: number;
}

export default function LifeViewer({
  title,
  content,
  nickname,
  profileImage,
  createdAt,
  imageUrlList,
  imageCount,
}: ILifeViewer) {
  return (
    <div className="w-full p-4">
      <div className="mb-2 flex items-center justify-between space-x-1 py-2">
        <div className="flex space-x-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={
                profileImage
                  ? profileImage
                  : "/images/placeholders/profile/default_profile.png"
              }
              alt="작성자 이미지"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="text-cool-grayscale-700">{nickname}</div>
        </div>
        <div className="text-cool-grayscale-500">
          {dateViewKoreanFull(createdAt)}
        </div>
      </div>
      <LifeCarousel imageUrlList={imageUrlList} />

      <div className="py-5 text-2xl font-bold text-cool-grayscale-800">
        {title}
      </div>
      <hr className="mb-4 h-1 border-none bg-cool-grayscale-50" />
      <p className="whitespace-pre text-wrap text-cool-grayscale-700">
        {content}
      </p>
    </div>
  );
}
