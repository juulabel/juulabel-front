import { create } from "zustand";

interface AuthorCheckState {
  isAuthor: boolean;
  setIsAuthor: (value: boolean) => void;
}

interface CommentsCountState {
  count: number;
  setCount: (value: number) => void;
}
interface CommentStore {
  showComments: boolean;
  toggleComments: () => void;
}

export const useAuthorCheckStore = create<AuthorCheckState>((set) => ({
  isAuthor: false,
  setIsAuthor: (value: boolean) => set({ isAuthor: value }),
}));

export const useCommentCountStore = create<CommentsCountState>((set) => ({
  count: -1,
  setCount: (value: number) => set({ count: value }),
}));

export const useCommentStore = create<CommentStore>((set) => ({
  showComments: false,
  toggleComments: () => set((state) => ({ showComments: !state.showComments })),
}));
