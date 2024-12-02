"use client";
import React, { MouseEvent } from "react";
import Image from "next/image";
import { IReply } from "@/_types";
import { dateView } from "@/_utils/time";
import useCommentsLike from "@/_utils/hooks/useCommentsLike";
import clsx from "clsx";
import useReplyComponentStore from "@/_store/replyComponentStore";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserInfo from "@/app/api/common/getCurrentUserInfo";
import { useCookies } from "react-cookie";
import useCommentsModalStore from "@/_store/tastingCommentModal";
import { usePathname } from "next/navigation";

interface Props {
  tastingNoteId: number;
  replyInfo: IReply;
  isAuthor: boolean;
}
const defaultUserImageURL =
  "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage";

export default function Reply({ replyInfo, tastingNoteId, isAuthor }: Props) {
  const pathname = usePathname();
  const { mutate } = useCommentsLike(pathname.includes("life"));
  const { isOpen, openModal } = useCommentsModalStore();

  return (
    <div className="flex w-full flex-col gap-3 border-b border-cool-grayscale-200 px-4 py-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
            <Image
              src={replyInfo.memberInfo.profileImage || defaultUserImageURL}
              fill
              alt="User Icon"
              layout="fixed"
              className="object-cover"
            />
          </div>

          <div className="flex flex-row items-center gap-1 text-[14px] text-cool-grayscale-600">
            <div>{replyInfo.memberInfo.nickname}</div>

            <svg
              width="2"
              height="2"
              viewBox="0 0 2 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="1" cy="1" r="1" fill="#94A3B8" />
            </svg>
            <span>{dateView(replyInfo.createdAt)}</span>
          </div>
        </div>
        {isAuthor && (
          <div
            className="cursor-pointer"
            onClick={() => {
              openModal({
                commmentId: replyInfo.commentId,
                postId: tastingNoteId,
                content: replyInfo.content,
              });
            }}
          >
            <Image
              src={"/svg/three-dots-horizontal-24.svg"}
              width={24}
              height={24}
              alt="점"
            />
          </div>
        )}
      </div>

      <div
        className="text-[14px] text-cool-grayscale-700"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {replyInfo.content}
      </div>

      <div className="flex flex-row justify-end gap-3">
        <div
          className="flex cursor-pointer flex-row items-center gap-1"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            e.preventDefault();

            mutate({
              postId: tastingNoteId,
              commentId: replyInfo.commentId,
              replyFlag: true,
            });
          }}
        >
          <Image
            src={replyInfo.isLiked ? "/svg/like_full.svg" : "/svg/like.svg"}
            width={20}
            height={20}
            alt="좋아요"
          />

          <span
            className={clsx({
              "text-primary-700": replyInfo.isLiked,
            })}
          >
            {replyInfo.likeCount}
          </span>
        </div>
      </div>
    </div>
  );
}
