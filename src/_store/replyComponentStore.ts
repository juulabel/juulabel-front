import { IComment } from "@/_types";
import { create } from "zustand";

interface ReplyState {
  isOpen: boolean;
  commentInfo: IComment | null;
  tastingNoteId: number | null;
  onOpen: () => void;
  onClose: () => void;
  setCommentInfo: (commentInfo: IComment | null) => void;
  setTastingNoteId: (id: number | null) => void;
}

const useReplyComponentStore = create<ReplyState>((set) => ({
  isOpen: false,
  tastingNoteId: null,
  commentInfo: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCommentInfo: (commentInfo: IComment | null) => set({ commentInfo }),
  setTastingNoteId: (id) => set({ tastingNoteId: id }),
}));

export default useReplyComponentStore;
