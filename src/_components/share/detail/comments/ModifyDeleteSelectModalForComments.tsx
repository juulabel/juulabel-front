"use client";

import ModalLayout from "@/_common/ModalLayout";
import Button from "@/_common/ui/Button";
import { useState } from "react";
import CommentsDeleteModal from "./CommentsDeleteModal";
import { useRouter } from "next/navigation";
import useReplyComponentStore from "@/_store/replyComponentStore";

interface Props {
  tastingNoteId: number;
  commentId: number;
  closeModal: () => void;
}

export default function ModifyDeleteSelectModalForComments({
  tastingNoteId,
  commentId,
  closeModal,
}: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const router = useRouter();
  if (deleteModalOpen) {
    return (
      <CommentsDeleteModal
        tastingNoteId={tastingNoteId}
        commentId={commentId}
        closeModal={closeModal}
      />
    );
  }

  return (
    <ModalLayout onClose={closeModal}>
      <div className="flex h-full w-full flex-col items-center gap-3">
        <Button
          variant="black"
          className="h-[37px] w-full rounded-[4px] text-[14px]"
          onClick={() => {
            router.push(`/share/note/${tastingNoteId}/comments`);
          }}
        >
          수정하기
        </Button>
        <Button
          variant="black"
          className="h-[37px] w-full rounded-[4px] text-[14px]"
          onClick={() => {
            setDeleteModalOpen(true);
            // closeModal();
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
