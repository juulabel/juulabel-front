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
import getLifeComments from "@/app/api/life/getLifeComment";
import VisitorsModalContent from "@/_components/report/VisitorsModalContent";

interface Props {
  id: number;
  isLife?: boolean;
}

export default function CommentsBody({ id, isLife }: Props) {
  const [cookies] = useCookies(["accessToken"]);

  const queryClient = useQueryClient();
  const { isOpen, closeModal, postId, commentId, type } =
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
    queryKey: [isLife ? "lifeComments" : "noteComments", Number(id)],
    queryFn: ({ pageParam }) =>
      isLife
        ? getLifeComments({
            token: cookies.accessToken,
            id: pageParam.id,
            lastCommentId: pageParam.lastCommentId,
          })
        : getNoteComments({
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
        {commentList?.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[18px]">
            <span className="text-[20px] font-bold">
              아직 등록된 댓글이 없습니다.
            </span>
            <span>첫 번째 댓글을 남겨보세요 !</span>
          </div>
        )}
        {commentList?.map((comment: IComment, index: number) => {
          if (comment.isDeleted) {
            return (
              <DeletedComments
                key={"d" + index}
                commentInfo={comment}
                postId={id}
              />
            );
          } else {
            return (
              <Comments
                commentInfo={comment}
                isAuthor={comment.memberInfo.memberId === memberInfo?.memberId}
                key={"c" + index}
                postId={id}
              />
            );
          }
        })}
        <div ref={observerRef}></div>
      </div>
      <ReplyWithComment />

      <CommentsFooter id={id} isLife={isLife} />

      {isOpen &&
        (type === "owner" ? (
          <ModifyDeleteSelectModalForComments
            postId={postId!}
            commentId={commentId!}
            closeModal={closeModal}
            isLife={isLife}
          />
        ) : (
          <ModalLayout onClose={closeModal}>
            <VisitorsModalContent
              targetId={(commentId ?? "").toString()}
              postId={(postId ?? "").toString()}
              type="댓글"
              text="댓글"
              handleModalClose={closeModal}
            />
          </ModalLayout>
        ))}
    </>
  );
}
