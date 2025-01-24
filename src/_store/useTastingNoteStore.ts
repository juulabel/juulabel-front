import { ITastingNoteRequest } from "@/_types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TastingNoteState {
  tastingNoteRequest: ITastingNoteRequest | null;
  imageUrlList: string[];
  setTastingNoteRequest: (data: ITastingNoteRequest) => void;
  setImageUrlList: (urlList: string[]) => void;
}

export const useTastingNoteStore = create(
  persist<TastingNoteState>(
    (set) => ({
      tastingNoteRequest: null,
      imageUrlList: [],
      setTastingNoteRequest: (data) => set({ tastingNoteRequest: data }),
      setImageUrlList: (urlList) => set({ imageUrlList: urlList }), // 이미지 URL 업데이트
    }),
    {
      name: "tasting-note-storage",
    },
  ),
);
