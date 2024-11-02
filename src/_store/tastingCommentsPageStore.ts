import { create } from "zustand";

interface CommentsPageState {
  isCommentsPageVisible: "Y" | "N" | "P";
  isInitialized: boolean;
  setCommentsPageVisible: (isVisible: "Y" | "N" | "P") => void;
  setIsInitialized: (isInitialized: boolean) => void;
}

const useCommentsPageStore = create<CommentsPageState>((set) => ({
  isCommentsPageVisible: "P",
  isInitialized: false,
  setCommentsPageVisible: (isVsisible: "Y" | "N" | "P") =>
    set({ isCommentsPageVisible: isVsisible }),
  setIsInitialized: (isInitialized: boolean) =>
    set({ isInitialized: isInitialized }),
}));

export { useCommentsPageStore };
