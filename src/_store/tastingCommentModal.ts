import { create } from "zustand";

interface Params {
  postId: number;
  commmentId: number;
  content?: string;
}

interface ModalState {
  isOpen: boolean;
  postId: number | null;
  commentId: number | null;
  content?: string;
  openModal: ({ postId, commmentId, content }: Params) => void;
  closeModal: () => void;
}

const useCommentsModalStore = create<ModalState>((set) => ({
  isOpen: false,
  postId: null,
  commentId: null,
  openModal: ({ postId, commmentId, content = "" }: Params) =>
    set({
      isOpen: true,
      postId: postId,
      commentId: commmentId,
      content: content,
    }),
  closeModal: () => {
    set({
      isOpen: false,
      postId: null,
      commentId: null,
    });
  },
}));

export default useCommentsModalStore;
