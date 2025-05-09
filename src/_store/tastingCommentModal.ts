import { create } from "zustand";

interface Params {
  postId: number;
  commentId: number;
  content?: string;
  type: "owner" | "visitor";
}

interface ModalState {
  isOpen: boolean;
  postId: number | null;
  commentId: number | null;
  content?: string;
  type: "owner" | "visitor" | null;
  openModal: ({ postId, commentId, content }: Params) => void;
  closeModal: () => void;
}

const useCommentsModalStore = create<ModalState>((set) => ({
  isOpen: false,
  postId: null,
  commentId: null,
  type: null,
  openModal: ({ postId, commentId, content = "", type }: Params) =>
    set({
      isOpen: true,
      postId: postId,
      commentId: commentId,
      content: content,
      type: type,
    }),
  closeModal: () => {
    set({
      isOpen: false,
      postId: null,
      commentId: null,
      type: null,
    });
  },
}));

export default useCommentsModalStore;
