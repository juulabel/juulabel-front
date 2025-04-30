import { create } from "zustand";

interface Params {
  postId: number;
  commmentId: number;
  content?: string;
  type: "owner" | "visitor";
}

interface ModalState {
  isOpen: boolean;
  postId: number | null;
  commentId: number | null;
  content?: string;
  type: "owner" | "visitor" | null;
  openModal: ({ postId, commmentId, content }: Params) => void;
  closeModal: () => void;
}

const useCommentsModalStore = create<ModalState>((set) => ({
  isOpen: false,
  postId: null,
  commentId: null,
  type: null,
  openModal: ({ postId, commmentId, content = "", type }: Params) =>
    set({
      isOpen: true,
      postId: postId,
      commentId: commmentId,
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
