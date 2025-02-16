"use client";

import React, { useEffect, useState } from "react";
import { PropsWithChildren, MouseEvent } from "react";
import Image from "next/image";
import { IComment } from "@/_types";
import ReplyBody from "./ReplyBody";
import useCommentsLike from "@/_utils/hooks/useCommentsLike";
import { useParams, usePathname } from "next/navigation";
import clsx from "clsx";
import useReplyComponentStore from "@/_store/replyComponentStore";

interface Props {
  commentInfo: IComment;
  postId: number;
}

export default function CommentsWithReplyWrapper({
  children,
  commentInfo,
  postId,
}: PropsWithChildren<Props>) {
  const { onOpen, setCommentInfo, setPostId } = useReplyComponentStore();
  const pathname = usePathname();
  const isLife = pathname.includes("life");
  const { mutate } = useCommentsLike(isLife);

  // commentId, tastingNotdId,

  return (
    <>
      <div
        className={clsx(
          "flex w-full flex-col gap-3 border-b border-cool-grayscale-200 px-5 py-5",
        )}
        onClick={() => {
          if (!!commentInfo && !!postId) {
            setCommentInfo(commentInfo);
            setPostId(postId);
            onOpen();
          }
        }}
      >
        {children}
        <div className="flex flex-row justify-end gap-3">
          <div className="flex flex-row items-center gap-1">
            <Image
              className="cursor-pointer"
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}${commentInfo.isLiked ? "/svg/like_full.svg" : "/svg/like.svg"}`}
              width={20}
              height={20}
              alt="좋아요"
              onClick={(e: MouseEvent<HTMLImageElement>) => {
                e.preventDefault();
                e.stopPropagation();

                mutate({
                  postId: postId,
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
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/speech_bubble.svg`}
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
        postId={postId}
        parentCommentId={commentInfo.commentId}
      /> */}
    </>
  );
}
