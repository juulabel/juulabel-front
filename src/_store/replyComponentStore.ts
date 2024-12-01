import { IComment } from "@/_types";
import { create } from "zustand";

interface ReplyState {
  isOpen: boolean;
  commentInfo: IComment | null;
  postId: number | null;
  onOpen: () => void;
  onClose: () => void;
  setCommentInfo: (commentInfo: IComment | null) => void;
  setPostId: (id: number | null) => void;
}

const useReplyComponentStore = create<ReplyState>((set) => ({
  isOpen: false,
  postId: null,
  commentInfo: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCommentInfo: (commentInfo: IComment | null) => set({ commentInfo }),
  setPostId: (id) => set({ postId: id }),
}));

export default useReplyComponentStore;
