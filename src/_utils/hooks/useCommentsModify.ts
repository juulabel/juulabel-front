import useReplyComponentStore from "@/_store/replyComponentStore";
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
      tastingNoteId,
      commentId,
      content,
    }: {
      tastingNoteId: number;
      commentId: number;
      content: string;
    }) => {
      onClose();

      await patchNoteComments({
        tastingNoteId: tastingNoteId,
        commentId: commentId,
        content: content,
      });
      return { tastingNoteId, commentId, content };
    },
    onSuccess: (data, variables) => {
      router.push(`/share/note/${variables.tastingNoteId}`);

      queryClient.invalidateQueries({
        queryKey: ["noteDetail", variables.tastingNoteId],
      });
      toast("댓글 내용을 수정했습니다.");
    },
    onError: () => {
      toast("댓글 내용을 수정실패했습니다.");
    },
  });

  return mutate;
}
