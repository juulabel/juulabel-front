import React, { MouseEvent } from "react";
import { IComment } from "@/_types";
import { dateView } from "@/_utils/time";
import Image from "next/image";
import ReplyBody from "./ReplyBody";
import CommentsWithReplyWrapper from "./CommentsWithReplyWrapper";
import useCommentsModalStore from "@/_store/tastingCommentModal";
import useReplyComponentStore from "@/_store/replyComponentStore";

interface Props {
  commentInfo: IComment;
  postId: number;
  isAuthor: boolean;
}
const defaultUserImageURL =
  "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage";

export default function Comments({
  commentInfo,
  isAuthor,
  postId,
}: Props) {
  const { isOpen, openModal } = useCommentsModalStore();
  const userImageURL =
    commentInfo.memberInfo.profileImage || defaultUserImageURL;

  const { onOpen } = useReplyComponentStore();

  return (
    <CommentsWithReplyWrapper
      commentInfo={commentInfo}
      postId={postId}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
            <Image
              src={userImageURL}
              fill
              alt="User Icon"
              layout="fixed"
              className="object-cover"
            />
          </div>

          <div className="flex flex-row items-center gap-1 text-[14px] text-cool-grayscale-600">
            <div>{commentInfo.memberInfo.nickname}</div>

            <svg
              width="2"
              height="2"
              viewBox="0 0 2 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="1" cy="1" r="1" fill="#94A3B8" />
            </svg>
            <span>{dateView(commentInfo.createdAt)}</span>
          </div>
        </div>
        {isAuthor && (
          <div>
            <Image
              src={"/svg/three-dots-horizontal-24.svg"}
              width={24}
              height={24}
              alt="점"
              className="cursor-pointer"
              onClick={(e: MouseEvent<HTMLImageElement>) => {
                e.stopPropagation();

                openModal({
                  commmentId: commentInfo.commentId,
                  postId: postId,
                  content: commentInfo.content,
                });
              }}
            />
          </div>
        )}
      </div>

      <div className="text-[14px] text-cool-grayscale-700">
        {commentInfo.content}
      </div>
    </CommentsWithReplyWrapper>
  );
}
