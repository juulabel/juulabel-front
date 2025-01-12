import { create } from "zustand";

interface TastingNoteCountState {
  tastingNoteTotalCount: number;
  alcoholicDrinksName: string | null;
  setTastingNoteTotalCount: (count: number) => void;
  setAlcoholicDrinksName: (name: string) => void;
}

const useTastingNoteStore = create<TastingNoteCountState>((set) => ({
  tastingNoteTotalCount: 0,
  alcoholicDrinksName: null,
  setTastingNoteTotalCount: (count) => set({ tastingNoteTotalCount: count }),
  setAlcoholicDrinksName: (name) => set({ alcoholicDrinksName: name }),
}));

export default useTastingNoteStore;
