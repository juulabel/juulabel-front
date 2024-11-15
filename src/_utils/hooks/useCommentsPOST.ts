/* eslint-disable */

import useReplyComponentStore from "@/_store/replyComponentStore";
import { IComment } from "@/_types";
import postDailyLifeComments from "@/app/api/life/postLifeComments";
import postNoteComments from "@/app/api/tasting-note/postNoteComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, RefObject, SetStateAction } from "react";
import { toast } from "react-toastify";

interface Params {
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  postId: number;
  textRef: RefObject<HTMLTextAreaElement>;
  setBtnDisabled: Dispatch<SetStateAction<boolean>>;
  isLife?: boolean;
}

export default function useCommentsPOST({
  setIsSubmitting,
  postId,
  setBtnDisabled,
  textRef,
  isLife,
}: Params) {
  const queryClient = useQueryClient();
  const {
    isOpen: replyComponentIsOpen,
    commentInfo,
    setCommentInfo,
  } = useReplyComponentStore();
  const mutate = useMutation({
    mutationFn: async ({
      id,
      content,
      parentCommentId,
    }: {
      id: number;
      content: string;
      parentCommentId?: number;
    }) => {
      isLife
        ? await postDailyLifeComments({
            id: id,
            content: content,
            parentCommentId: parentCommentId,
          })
        : await postNoteComments({
            id: id,
            content: content,
            parentCommentId: parentCommentId,
          });

      return { parentCommentId };
    },
    onSuccess: ({ parentCommentId }) => {
      toast("댓글을 추가했어요.");

      queryClient.invalidateQueries({
        queryKey: [isLife ? "lifeComments" : "noteComments", Number(postId)],
        refetchType: "all",
      });

      queryClient.refetchQueries({
        queryKey: [isLife ? "lifeDetail" : "noteDetail", Number(postId)],
      });

      setIsSubmitting(false);

      if (textRef.current) {
        textRef.current.value = "";
        setBtnDisabled(true);
      }
      console.log(commentInfo);
      //대댓글인 경우
      if (replyComponentIsOpen && commentInfo) {
        if (commentInfo && commentInfo.commentId === parentCommentId) {
          setCommentInfo({
            ...commentInfo,
            replyCount: commentInfo.replyCount + 1,
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["getReply", postId, parentCommentId],
        });
      }
    },
    onError: (error) => {
      console.log(error);

      toast("댓글 추가를 실패했어요.");
      setIsSubmitting(false);
    },
    onSettled: () => {},
  });

  return mutate;
}
