import { ITastingNoteRequest } from "@/_types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TastingNoteState {
  tastingNoteRequest: ITastingNoteRequest | null;
  setTastingNoteRequest: (data: ITastingNoteRequest) => void;
}

export const useTastingNoteStore = create(
  persist<TastingNoteState>(
    (set) => ({
      tastingNoteRequest: null,
      setTastingNoteRequest: (data) => set({ tastingNoteRequest: data }),
    }),
    {
      name: "tasting-note-storage",
    },
  ),
);
