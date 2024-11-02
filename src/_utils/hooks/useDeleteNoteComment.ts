import useReplyComponentStore from "@/_store/replyComponentStore";
import deleteNoteComments from "@/app/api/tasting-note/deleteNoteComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useDeleteNoteComment() {
  const queryClient = useQueryClient();
  const { isOpen, commentInfo } = useReplyComponentStore();

  const mutate = useMutation({
    mutationFn: async ({
      tastingNoteId,
      commentId,
    }: {
      tastingNoteId: number;
      commentId: number;
    }) => {
      await deleteNoteComments({
        tastingNoteId: tastingNoteId,
        commentId: commentId,
      });
    },
    onSuccess: (_, { tastingNoteId, commentId }) => {
      toast("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["note", Number(tastingNoteId)],
      });

      if (isOpen) {
        queryClient.invalidateQueries({
          queryKey: ["getReply", tastingNoteId, commentInfo?.commentId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["noteComments", Number(tastingNoteId)],
        });
      }
    },
  });

  return mutate;
}
