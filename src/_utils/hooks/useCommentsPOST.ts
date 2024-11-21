import useReplyComponentStore from "@/_store/replyComponentStore";
import { IComment } from "@/_types";
import postNoteComments from "@/app/api/tasting-note/postNoteComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, RefObject, SetStateAction } from "react";
import { toast } from "react-toastify";

interface Params {
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  tastingNoteId: number;
  textRef: RefObject<HTMLTextAreaElement>;
  setBtnDisabled: Dispatch<SetStateAction<boolean>>;
}

export default function useCommentsPOST({
  setIsSubmitting,
  tastingNoteId,
  setBtnDisabled,
  textRef,
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
      await postNoteComments({
        id: id,
        content: content,
        parentCommentId: parentCommentId,
      });

      return { parentCommentId };
    },
    onSuccess: ({ parentCommentId }) => {
      toast("댓글을 추가했어요.");

      queryClient.invalidateQueries({
        queryKey: ["noteComments", Number(tastingNoteId)],
        refetchType: "all",
      });

      queryClient.refetchQueries({
        queryKey: ["noteDetail", Number(tastingNoteId)],
      });

      setIsSubmitting(false);

      if (textRef.current) {
        textRef.current.value = "";
        setBtnDisabled(true);
      }
      //대댓글인 경우
      if (replyComponentIsOpen && commentInfo) {
        if (commentInfo && commentInfo.commentId === parentCommentId) {
          setCommentInfo({
            ...commentInfo,
            replyCount: commentInfo.replyCount + 1,
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["getReply", tastingNoteId, parentCommentId],
        });
      }
    },
    onError: (error) => {
      toast("댓글 추가를 실패했어요.");
      setIsSubmitting(false);
    },
    onSettled: () => {},
  });

  return mutate;
}
