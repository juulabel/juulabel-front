import useReplyComponentStore from "@/_store/replyComponentStore";
import { deleteDailyLife } from "@/app/api/life/deleteDailyLife";
import deleteDailyLifeComments from "@/app/api/life/deleteLifeComments";
import deleteNoteComments from "@/app/api/tasting-note/deleteNoteComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useDeleteNoteComment() {
  const queryClient = useQueryClient();
  const { isOpen, commentInfo } = useReplyComponentStore();

  const mutate = useMutation({
    mutationFn: async ({
      postId,
      commentId,
      isLife,
    }: {
      postId: number;
      commentId: number;
      isLife?: boolean;
    }) => {
      isLife
        ? await deleteDailyLifeComments({
            dailyLifeId: postId,
            commentId: commentId,
          })
        : await deleteNoteComments({
            postId: postId,
            commentId: commentId,
          });
    },
    onSuccess: (_, { postId, commentId, isLife }) => {
      toast("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: [isLife ? "life" : "note", Number(postId)],
      });

      if (isOpen) {
        queryClient.invalidateQueries({
          queryKey: ["getReply", postId, commentInfo?.commentId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [isLife ? "lifeComments" : "noteComments", Number(postId)],
        });
      }
    },
  });

  return mutate;
}
