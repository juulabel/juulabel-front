import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ITastingNoteInformation {
  productName: string;
  alcoholContent: string;
  alcoholType: string;
  brewery: string;
  breweryLocation: string;
  rgbColor: string;
  scents: string[];
  setProductName: (value: string) => void;
  setAlcoholContent: (value: string) => void;
  setAlcoholType: (value: string) => void;
  setBrewery: (value: string) => void;
  setBreweryLocation: (value: string) => void;
  setRgbColor: (value: string) => void;
  setScents: (scents: string[]) => void;
}

export const useTastingNoteInformationStore = create(
  persist<ITastingNoteInformation>(
    (set) => ({
      productName: "",
      alcoholContent: "",
      alcoholType: "",
      brewery: "",
      breweryLocation: "",
      rgbColor: "",
      scents: [],
      setProductName: (value: string) =>
        set((state) => ({ ...state, productName: value })),
      setAlcoholContent: (value: string) =>
        set((state) => ({ ...state, alcoholContent: value })),
      setAlcoholType: (value: string) =>
        set((state) => ({ ...state, alcoholType: value })),
      setBrewery: (value: string) =>
        set((state) => ({ ...state, brewery: value })),
      setBreweryLocation: (value: string) =>
        set((state) => ({ ...state, breweryLocation: value })),
      setRgbColor: (value: string) =>
        set((state) => ({ ...state, rgbColor: value })),
      setScents: (scents: string[]) => set(() => ({ scents })),
    }),
    { name: "TastingNoteInformationStorage" },
  ),
);
