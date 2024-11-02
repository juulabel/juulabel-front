/* eslint-disable */
import useReplyComponentStore from "@/_store/replyComponentStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ICommonProps {
  tastingNoteId: number;
  commentId: number;
}

export default function useOptimisticUpdate() {
  const queryClient = useQueryClient();
  const {
    isOpen: replyComponentIsOpen,
    commentInfo,
    setCommentInfo,
  } = useReplyComponentStore();

  const replyOptimisticUpdate = async ({
    tastingNoteId,
    commentId, //대댓글의 id
  }: ICommonProps) => {
    await queryClient.cancelQueries({
      queryKey: ["getReply", tastingNoteId, commentInfo?.commentId],
    });

    const previousNoteCommentsData = queryClient.getQueryData([
      "getReply",
      tastingNoteId,
      commentId,
    ]);

    queryClient.setQueryData(
      ["getReply", tastingNoteId, commentInfo?.commentId],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            return {
              ...page,
              data: page.data.map((reply: any) => {
                if (commentId === reply.commentId) {
                  const isCurrentlyLiked = reply.isLiked;
                  const updatedLikeCount = isCurrentlyLiked
                    ? reply.likeCount - 1
                    : reply.likeCount + 1;

                  if (isCurrentlyLiked) {
                    toast("해당 댓글에 좋아요를 취소했어요.");
                  } else {
                    toast("해당 댓글에 좋아요를 눌렀어요.");
                  }

                  return {
                    ...reply,
                    likeCount: updatedLikeCount,
                    isLiked: !isCurrentlyLiked,
                  };
                }

                return reply;
              }),
            };
          }),
        };
      },
    );

    return { previousNoteCommentsData };
  };
  const commentsOptimisticUpdate = async ({
    tastingNoteId,
    commentId,
  }: ICommonProps) => {
    await queryClient.cancelQueries({
      queryKey: ["noteComments", tastingNoteId],
    });

    const previousNoteCommentsData = queryClient.getQueryData([
      "noteComments",
      tastingNoteId,
    ]);

    queryClient.setQueryData(
      ["noteComments", tastingNoteId],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          // pages 구조를 유지하면서 각 페이지에서 특정 댓글을 찾아 업데이트
          pages: oldData.pages.map((page: any) => {
            return {
              ...page,
              data: page.data.map((comment: any) => {
                if (comment.commentId === commentId) {
                  const isCurrentlyLiked = comment.isLiked;
                  const updatedLikeCount = isCurrentlyLiked
                    ? comment.likeCount - 1
                    : comment.likeCount + 1;

                  if (isCurrentlyLiked) {
                    toast("해당 댓글에 좋아요를 취소했어요.");
                  } else {
                    toast("해당 댓글에 좋아요를 눌렀어요.");
                  }

                  // 대댓글 페이지에서 좋아요 클릭 시
                  if (replyComponentIsOpen && commentInfo) {
                    setCommentInfo({
                      ...commentInfo,
                      likeCount: updatedLikeCount,
                      isLiked: !isCurrentlyLiked,
                    });
                  }

                  return {
                    ...comment,
                    likeCount: updatedLikeCount,
                    isLiked: !isCurrentlyLiked,
                  };
                }
                return comment;
              }),
            };
          }),
        };
      },
    );
    return previousNoteCommentsData;
  };

  return { commentsOptimisticUpdate, replyOptimisticUpdate };
}
