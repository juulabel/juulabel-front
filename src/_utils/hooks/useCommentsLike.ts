/* eslint-disable */

import useReplyComponentStore from "@/_store/replyComponentStore";
import postNoteCommentsLike from "@/app/api/tasting-note/postNoteCommentsLike";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useOptimisticUpdate from "./useOptimisticUpdate";
import postLifeCommentsLike from "@/app/api/life/postLifeCommentLike";

export default function useCommentsLike(isLife: boolean) {
  const { commentsOptimisticUpdate, replyOptimisticUpdate } =
    useOptimisticUpdate(isLife);

  const queryClient = useQueryClient();
  const {
    isOpen: replyComponentIsOpen,
    commentInfo,
    setCommentInfo,
  } = useReplyComponentStore();

  const { mutate } = useMutation({
    mutationFn: ({
      postId,
      commentId,
      replyFlag,
    }: {
      postId: number;
      commentId: number;
      replyFlag?: boolean;
    }) =>
      isLife
        ? postLifeCommentsLike({
            postId,
            commentId,
          })
        : postNoteCommentsLike({
            postId,
            commentId,
          }),
    onMutate: ({ postId, commentId, replyFlag }) => {
      let previousNoteCommentsData: any;
      if (replyFlag) {
        previousNoteCommentsData = replyOptimisticUpdate({
          postId,
          commentId,
        });
      } else {
        previousNoteCommentsData = commentsOptimisticUpdate({
          postId,
          commentId,
        });
      }

      return { previousNoteCommentsData };
    },
    onError: (err, variables, context: any) => {
      // 오류 발생 시 이전 데이터를 롤백
      console.error(err);

      queryClient.setQueryData(
        [isLife ? "lifeComments" : "noteComments", variables.postId],
        context.previousNoteCommentsData,
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [isLife ? "lifeComments" : "noteComments", variables.postId],
      });
    },
  });

  useEffect(() => {}, []);
  return { mutate };
}
