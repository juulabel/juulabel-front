import { create } from "zustand";

interface Params {
  tastingNoteId: number;
  commmentId: number;
  content?: string;
}

interface ModalState {
  isOpen: boolean;
  tastingNoteId: number | null;
  commentId: number | null;
  content?: string;
  openModal: ({ tastingNoteId, commmentId, content }: Params) => void;
  closeModal: () => void;
}

const useCommentsModalStore = create<ModalState>((set) => ({
  isOpen: false,
  tastingNoteId: null,
  commentId: null,
  openModal: ({ tastingNoteId, commmentId, content = "" }: Params) =>
    set({
      isOpen: true,
      tastingNoteId: tastingNoteId,
      commentId: commmentId,
      content: content,
    }),
  closeModal: () => {
    set({
      isOpen: false,
      tastingNoteId: null,
      commentId: null,
    });
  },
}));

export default useCommentsModalStore;
