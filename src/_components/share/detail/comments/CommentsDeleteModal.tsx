"use client";
import ModalLayout from "@/_common/ModalLayout";
import Button from "@/_common/ui/Button";
import useReplyComponentStore from "@/_store/replyComponentStore";
import useDeleteNoteComment from "@/_utils/hooks/useDeleteNoteComment";

interface Props {
  postId: number;
  commentId: number;
  closeModal: () => void;
  isLife?: boolean;
}

export default function CommentsDeleteModal({
  postId,
  commentId,
  closeModal,
  isLife,
}: Props) {
  const { mutate } = useDeleteNoteComment();

  return (
    <ModalLayout onClose={closeModal}>
      <div className="flex h-full w-full flex-col items-center gap-3">
        <div className="mb-[24px] h-[27px] w-full text-center text-[18px] font-bold leading-[27px] text-cool-grayscale-800">
          댓글을 삭제하시겠어요?
        </div>
        <Button
          variant="primary"
          className="h-[37px] w-full rounded-[4px] text-[14px]"
          onClick={() => {
            mutate({
              postId: postId,
              commentId: commentId,
              isLife: isLife,
            });
            closeModal();
          }}
        >
          삭제하기
        </Button>

        <Button
          variant="none"
          className="h-[37px] w-full rounded-[4px] text-[14px]"
          onClick={closeModal}
        >
          닫기
        </Button>
      </div>
    </ModalLayout>
  );
}
