"use client";

import Image from "next/image";

interface Props {
  likeCount: number;
}

export default function DeletedCommentsForReply({ likeCount }: Props) {
  return (
    <div className="flex-col bg-cool-grayscale-200 px-5 py-5">
      <div className="flex h-[42px] flex-row items-center gap-2">
        <div className="relative z-20 h-[24px] w-[24px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/anonymous_user_icon.svg`}
            fill
            className="object-cover"
            alt="user"
          />
        </div>
        <div className="text-[14px] font-normal leading-[21px] text-cool-grayscale-400">
          삭제된 댓글입니다.
        </div>
      </div>
      <div className="flex flex-row justify-end gap-3">
        <div className="flex flex-row items-center gap-1">
          <Image
            className="cursor-pointer"
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/like.svg`}
            width={20}
            height={20}
            alt="좋아요"
          />

          <span className="text-cool-grayscale-500">{likeCount}</span>
        </div>
      </div>
    </div>
  );
}
