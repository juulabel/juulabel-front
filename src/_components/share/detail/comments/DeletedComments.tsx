"use client";

import React, { MouseEvent } from "react";
import useReplyComponentStore from "@/_store/replyComponentStore";
import { IComment } from "@/_types";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  commentInfo: IComment;
  tastingNoteId: number;
}

export default function DeletedComments({ commentInfo, tastingNoteId }: Props) {
  const { onOpen, setCommentInfo, setTastingNoteId } = useReplyComponentStore();

  return (
    <div
      className="flex-col bg-cool-grayscale-200 px-5 py-5"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setCommentInfo(commentInfo);
        setTastingNoteId(tastingNoteId);
        onOpen();
      }}
    >
      <div className="flex h-[42px] flex-row items-center gap-2">
        <div className="relative z-20 h-[24px] w-[24px]">
          <Image
            src={"/svg/anonymous_user_icon.svg"}
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
            src={"/svg/like.svg"}
            width={20}
            height={20}
            alt="좋아요"
          />

          <span className="text-cool-grayscale-500">
            {commentInfo.likeCount}
          </span>
        </div>

        <div className="flex flex-row items-center gap-1">
          <Image
            src={"/svg/speech_bubble.svg"}
            width={20}
            height={20}
            className="cursor-pointer"
            alt="좋아요"
          />

          <span className="text-cool-grayscale-500">
            {commentInfo.replyCount}
          </span>
        </div>
      </div>
    </div>
  );
}
