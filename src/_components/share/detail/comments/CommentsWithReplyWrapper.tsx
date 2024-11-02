"use client";

import React, { useEffect, useState } from "react";
import { PropsWithChildren, MouseEvent } from "react";
import Image from "next/image";
import { IComment } from "@/_types";
import ReplyBody from "./ReplyBody";
import useCommentsLike from "@/_utils/hooks/useCommentsLike";
import { useParams } from "next/navigation";
import clsx from "clsx";
import useReplyComponentStore from "@/_store/replyComponentStore";

interface Props {
  commentInfo: IComment;
  tastingNoteId: number;
}

export default function CommentsWithReplyWrapper({
  children,
  commentInfo,
  tastingNoteId,
}: PropsWithChildren<Props>) {
  const { mutate } = useCommentsLike();
  const { onOpen, setCommentInfo, setTastingNoteId } = useReplyComponentStore();
  // commentId, tastingNotdId,

  useEffect(() => {}, []);
  return (
    <>
      <div
        className={clsx(
          "flex w-full flex-col gap-3 border-b border-cool-grayscale-200 px-5 py-5",
        )}
        onClick={() => {
          if (!!commentInfo && !!tastingNoteId) {
            setCommentInfo(commentInfo);
            setTastingNoteId(tastingNoteId);
            onOpen();
          }
        }}
      >
        {children}
        <div className="flex flex-row justify-end gap-3">
          <div className="flex flex-row items-center gap-1">
            <Image
              className="cursor-pointer"
              src={commentInfo.isLiked ? "/svg/like_full.svg" : "/svg/like.svg"}
              width={20}
              height={20}
              alt="좋아요"
              onClick={(e: MouseEvent<HTMLImageElement>) => {
                e.preventDefault();
                e.stopPropagation();

                mutate({
                  tastingNoteId: tastingNoteId,
                  commentId: commentInfo.commentId,
                });
              }}
            />

            <span
              className={clsx("text-cool-grayscale-500", {
                "text-primary-700": commentInfo.isLiked,
              })}
            >
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
      {/* <ReplyBody
        replyOpen={replyOpen}
        handleReplyClose={handleReplyClose}
        tastingNoteId={tastingNoteId}
        parentCommentId={commentInfo.commentId}
      /> */}
    </>
  );
}
