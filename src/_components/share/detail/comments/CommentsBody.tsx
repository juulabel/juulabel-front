"use client";

import React, { useEffect, useRef, useState } from "react";
import Comments from "./Comments";
import getNoteComments from "@/app/api/tasting-note/getNoteComments";
import { useCookies } from "react-cookie";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IComment, IReply } from "@/_types";
import getCurrentUserInfo from "@/app/api/common/getCurrentUserInfo";
import CommentsFooter from "./CommentsFooter";
import Skeleton from "react-loading-skeleton";
import SkeletonUI from "./SkeletonUI";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import ServerToast from "../../error/ServerToast";
import ModalLayout from "@/_common/ModalLayout";
import Button from "@/_common/ui/Button";
import useCommentsModalStore from "@/_store/tastingCommentModal";
import deleteNoteComments from "@/app/api/tasting-note/deleteNoteComments";
import { toast } from "react-toastify";
import clsx from "clsx";
import useReplyComponentStore from "@/_store/replyComponentStore";
import ReplyWithComment from "./ReplyWithComment";
import DeletedComments from "./DeletedComments";
import ModifyDeleteSelectModalForComments from "./ModifyDeleteSelectModalForComments";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import useMemberStore from "@/_store/memberStore";

interface Props {
  id: number;
}

export default function CommentsBody({ id }: Props) {
  const [cookies] = useCookies(["accessToken"]);

  const queryClient = useQueryClient();
  const { isOpen, closeModal, tastingNoteId, commentId } =
    useCommentsModalStore();

  const { isOpen: replyComponentIsOpen } = useReplyComponentStore();

  const { isCommentsPageVisible, isInitialized, setIsInitialized } =
    useCommentsPageStore();

  const { memberInfo } = useMemberStore();

  const {
    data: commentList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["noteComments", Number(id)],
    queryFn: ({ pageParam }) =>
      getNoteComments({
        token: cookies.accessToken,
        id: pageParam.id,
        lastCommentId: pageParam.lastCommentId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.length) return null;
      return lastPage.last
        ? null
        : {
            lastCommentId: lastPage.data.slice(-1)[0].commentId || null,
            id: id,
          };
    },
    initialPageParam: { lastCommentId: null, id: id },
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
  // 애니메이션 첫 교화때문에 놔둠

  useEffect(() => {
    return () => {};
  }, [isFetching, commentList, isFetchingNextPage]);

  // if (isFetching && !isFetchingNextPage && !commentList?.length) {
  //   return <SkeletonUI />;
  // }

  if (isError) {
    return <ServerToast text="에러가 발생했습니다" redirectPath="/" />;
  }
  return (
    <>
      <div
        className={clsx(
          "fixed bottom-0 z-30 h-full w-full max-w-[560px] overflow-y-scroll bg-white pb-[84px] pt-[64px]",
          {
            "animate-fadeOut scale-90 overflow-hidden opacity-90 blur-lg":
              replyComponentIsOpen,
            "animate-slideDown": isCommentsPageVisible === "N",
            "animate-slideUp": isCommentsPageVisible === "Y",
            "transition-all duration-700": isCommentsPageVisible !== "P",
            hidden: isCommentsPageVisible === "P",
          },
        )}
      >
        {commentList?.map((comment: IComment, index: number) => {
          if (comment.isDeleted) {
            return (
              <DeletedComments
                key={"d" + index}
                commentInfo={comment}
                tastingNoteId={id}
              />
            );
          } else {
            return (
              <Comments
                commentInfo={comment}
                isAuthor={comment.memberInfo.memberId === memberInfo?.memberId}
                key={"c" + index}
                tastingNoteId={id}
              />
            );
          }
        })}
        <div ref={observerRef}></div>
      </div>
      <ReplyWithComment />

      <CommentsFooter id={id} />

      {isOpen && (
        <ModifyDeleteSelectModalForComments
          tastingNoteId={tastingNoteId!}
          commentId={commentId!}
          closeModal={closeModal}
        />
      )}
    </>
  );
}
