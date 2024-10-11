import { create } from "zustand";

interface AuthorCheckState {
  isAuthor: boolean;
  setIsAuthor: (value: boolean) => void;
}

export const useAuthorCheckStore = create<AuthorCheckState>((set) => ({
  isAuthor: false,
  setIsAuthor: (value: boolean) => set({ isAuthor: value }),
}));
