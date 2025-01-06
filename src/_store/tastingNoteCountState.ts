import { create } from "zustand";

interface TastingNoteCountState {
  tastingNoteTotalCount: number;
  setTastingNoteTotalCount: (count: number) => void;
}

const useTastingNoteStore = create<TastingNoteCountState>((set) => ({
  tastingNoteTotalCount: 0,
  setTastingNoteTotalCount: (count) => set({ tastingNoteTotalCount: count }),
}));

export default useTastingNoteStore;
