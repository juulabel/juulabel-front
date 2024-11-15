/* eslint-disable */

import useReplyComponentStore from "@/_store/replyComponentStore";
import patchDailyLifeComments from "@/app/api/life/patchLifeComments";
import patchNoteComments from "@/app/api/tasting-note/patchNoteComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useCommentsModify() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const { onClose } = useReplyComponentStore();

  const mutate = useMutation({
    mutationFn: async ({
      postId,
      commentId,
      content,
      isLife,
    }: {
      postId: number;
      commentId: number;
      content: string;
      isLife: boolean;
    }) => {
      onClose();
      isLife
        ? await patchDailyLifeComments({
            dailyLifeId: postId,
            commentId: commentId,
            content: content,
          })
        : await patchNoteComments({
            tastingNoteId: postId,
            commentId: commentId,
            content: content,
          });
      return { postId, commentId, content };
    },
    onSuccess: (data, variables) => {
      router.push(
        variables.isLife
          ? `/share/life/${variables.postId}`
          : `/share/note/${variables.postId}`,
      );

      queryClient.invalidateQueries({
        queryKey: [
          variables.isLife ? "lifeDetail" : "noteDetail",
          variables.postId,
        ],
      });
      toast("댓글 내용을 수정했습니다.");
    },
    onError: () => {
      toast("댓글 내용을 수정실패했습니다.");
    },
  });

  return mutate;
}
