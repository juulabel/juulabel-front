"use client";
import clsx from "clsx";
import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import getReply from "@/app/api/tasting-note/getReply";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { IReply } from "@/_types";
import Reply from "./Reply";
import getCurrentUserInfo from "@/app/api/common/getCurrentUserInfo";
import { useCookies } from "react-cookie";
import DeletedComments from "./DeletedComments";
import DeletedCommentsForReply from "./DeletedCommentsForReply";
import useMemberStore from "@/_store/memberStore";
import { usePathname } from "next/navigation";
import getDailyLifeReply from "@/app/api/life/getDailyLifeReply";

interface Props {
  parentCommentId: number;
  postId: number;
}

/**
 * @note 답글 컴포넌트
 */
export default function ReplyList({ postId, parentCommentId }: Props) {
  const pathname = usePathname();
  const isLife = pathname.includes("life");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { memberInfo } = useMemberStore();
  const [cookies] = useCookies(["accessToken"]);

  const {
    data: replyList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    status,
  } = useInfiniteQuery({
    queryKey: ["getReply", postId, parentCommentId],
    queryFn: ({ pageParam }) =>
      isLife
        ? getDailyLifeReply({
            dailyLifeCommentId: pageParam.parentCommentId,
            dailyLifeId: pageParam.postId,
            lastReplyId: pageParam.lastReplyId,
          })
        : getReply({
            tastingNoteCommentId: pageParam.parentCommentId,
            tastingNoteId: pageParam.postId,
            lastReplyId: pageParam.lastReplyId,
          }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.data.length) return null;

      return lastPage.last
        ? null
        : {
            lastReplyId: lastPage.data.slice(-1)[0].commentId || null,
            parentCommentId: parentCommentId,
            postId: postId,
          };
    },
    initialPageParam: {
      parentCommentId: parentCommentId,
      postId: postId,
      lastReplyId: null,
    },
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
    gcTime: 0,
    staleTime: 0,
  });

  const observerRef = useInfiniteScroll({
    hasNextPage: hasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    fetchNextPage: fetchNextPage,
  });

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 3000);
  });

  return (
    <>
      <div className={clsx("overflow-hidden")}>
        <ul className="mt-4">
          {replyList?.map((reply: IReply, index) => {
            if (reply.isDeleted) {
              return (
                <DeletedCommentsForReply
                  key={"d" + index}
                  likeCount={reply.likeCount}
                />
              );
            } else {
              return (
                <li key={index} className="">
                  <Reply
                    replyInfo={reply}
                    tastingNoteId={postId}
                    isAuthor={
                      memberInfo?.memberId === reply.memberInfo.memberId
                    }
                  />
                </li>
              );
            }
          })}
        </ul>
      </div>
      <div ref={observerRef}></div>
    </>
  );
}
