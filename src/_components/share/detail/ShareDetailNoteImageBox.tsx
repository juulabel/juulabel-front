"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { placeholderThumbnailProvider } from "@/_components/tasting-note/NoteThumbnail";
import FullScreenImageCarousel from "@/_common/FullScreenImageCarousel";
import { dateViewKoreanFull } from "@/_utils/time";
import { ITastingNoteDetailInfo } from "@/_types";
import LifeCarousel from "../life/LifeCarousel";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
  imageList: string[];
}

const userDefaultImg = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;

export default function ShareDetailNoteImageBox({ info, imageList }: Props) {
  const defaultImage = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/alcohols/${placeholderThumbnailProvider(info?.alcoholTypeName || "소주")}.png`;
  const userDefaultImage = info?.memberInfo.profileImage || userDefaultImg;
  const imagesToUse = imageList.length > 0 ? imageList : [defaultImage];

  if (!info) {
    return <div></div>;
  }

  return (
    <div className="w-full">
      {/* 유저 헤더영역 */}
      <div className="flex h-[64px] items-center justify-between px-5">
        <Link
          href={`/user/profile/${info.memberInfo.memberId}`}
          className="flex h-full items-center gap-[12px]"
        >
          <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
            <Image
              src={userDefaultImage}
              fill
              alt="User Icon"
              className="object-cover"
            />
          </div>
          <div className="text-[14px] font-semibold text-[#334155]">
            {info.memberInfo.nickname}
          </div>
        </Link>

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
