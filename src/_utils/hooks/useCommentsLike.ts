/* eslint-disable */

import useReplyComponentStore from "@/_store/replyComponentStore";
import postNoteCommentsLike from "@/app/api/tasting-note/postNoteCommentsLike";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useOptimisticUpdate from "./useOptimisticUpdate";

export default function useCommentsLike() {
  const { commentsOptimisticUpdate, replyOptimisticUpdate } =
    useOptimisticUpdate();

  const queryClient = useQueryClient();
  const {
    isOpen: replyComponentIsOpen,
    commentInfo,
    setCommentInfo,
  } = useReplyComponentStore();

  const { mutate } = useMutation({
    mutationFn: ({
      tastingNoteId,
      commentId,
      replyFlag,
    }: {
      tastingNoteId: number;
      commentId: number;
      replyFlag?: boolean;
    }) =>
      postNoteCommentsLike({
        tastingNoteId,
        commentId,
      }),
    onMutate: ({ tastingNoteId, commentId, replyFlag }) => {
      let previousNoteCommentsData: any;
      if (replyFlag) {
        previousNoteCommentsData = replyOptimisticUpdate({
          tastingNoteId,
          commentId,
        });
      } else {
        previousNoteCommentsData = commentsOptimisticUpdate({
          tastingNoteId,
          commentId,
        });
      }

      return { previousNoteCommentsData };
    },
    onError: (err, variables, context: any) => {
      // 오류 발생 시 이전 데이터를 롤백
      queryClient.setQueryData(
        ["noteComments", variables.tastingNoteId],
        context.previousNoteCommentsData,
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["noteComments", variables.tastingNoteId],
      });
    },
  });

  useEffect(() => {}, []);
  return { mutate };
}
