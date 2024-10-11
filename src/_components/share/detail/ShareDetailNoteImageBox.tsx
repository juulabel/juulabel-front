"use client";

import { useEffect } from "react";
import LifeCarousel from "../life/LifeCarousel";
import Image from "next/image";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { ITastingNoteDetailInfo } from "@/_types";
import { dateViewKoreanFull } from "@/_utils/time";
import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
  imageList: string[];
}

const images = [
  "https://via.placeholder.com/600x400?text=Image+1",
  "https://via.placeholder.com/600x400?text=Image+2",
  "https://via.placeholder.com/600x400?text=Image+3",
  "https://via.placeholder.com/600x400?text=Image+4",
];

export default function ShareDetailNoteImageBox({ info, imageList }: Props) {
  const defaultImage = `/images/placeholders/alcohols/${placeholderThumbnailProvider(info?.alcoholTypeName || "소주")}.png`;
  const imagesToUse = imageList.length > 0 ? imageList : [defaultImage];
  useEffect(() => {});

  if (!info) {
    return <div></div>;
  }

  return (
    <div className="w-full">
      {/* 유저 헤더영역 */}
      <div className="flex h-[64px] items-center justify-between px-5">
        <div className="flex h-full items-center gap-[12px]">
          <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
            <Image
              src="https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage"
              fill
              alt="User Icon"
              layout="fixed"
              className="object-cover"
            />
          </div>
          <div className="text-[14px] font-semibold text-[#334155]">
            {info.memberInfo.nickname}
          </div>
        </div>

        <div className="text-[14px] font-semibold text-[#64748B]">
          {dateViewKoreanFull(info.createdAt)}
        </div>
      </div>

      <div className="w-full px-3">
        <LifeCarousel imageUrlList={imagesToUse} />
      </div>
    </div>
  );
}
