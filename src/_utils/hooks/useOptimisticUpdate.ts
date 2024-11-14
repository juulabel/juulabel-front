/* eslint-disable */
import useReplyComponentStore from "@/_store/replyComponentStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ICommonProps {
  postId: number;
  commentId: number;
}

export default function useOptimisticUpdate(isLife: boolean) {
  const queryClient = useQueryClient();
  const {
    isOpen: replyComponentIsOpen,
    commentInfo,
    setCommentInfo,
  } = useReplyComponentStore();

  const replyOptimisticUpdate = async ({
    postId,
    commentId, //대댓글의 id
  }: ICommonProps) => {
    await queryClient.cancelQueries({
      queryKey: ["getReply", postId, commentInfo?.commentId],
    });

    const previousNoteCommentsData = queryClient.getQueryData([
      "getReply",
      postId,
      commentId,
    ]);

    queryClient.setQueryData(
      ["getReply", postId, commentInfo?.commentId],
      (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.pages)) return oldData; // Ensure pages exists and is an array

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
    postId,
    commentId,
  }: ICommonProps) => {
    await queryClient.cancelQueries({
      queryKey: [isLife ? "lifeComments" : "noteComments", postId],
    });

    const previousNoteCommentsData = queryClient.getQueryData([
      isLife ? "lifeComments" : "noteComments",
      postId,
    ]);

    queryClient.setQueryData(
      [isLife ? "lifeComments" : "noteComments", postId],
      (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData; // Ensure pages exists

        return {
          ...oldData,
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
