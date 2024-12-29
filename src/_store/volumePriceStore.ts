import { IVolumePriceDetails } from "@/_types/tasting-note/officialData";
import { create } from "zustand";

interface VolumePriceStore {
  volumePriceDetails: IVolumePriceDetails[];
  selectedVolumePriceDetails: IVolumePriceDetails | null;
  setVolumePriceDetails: (details: IVolumePriceDetails[]) => void;
  setSelectedVolumePriceDetails: (detail: IVolumePriceDetails | null) => void;
  clearVolumePriceDetails: () => void;
}

const useVolumePriceStore = create<VolumePriceStore>((set) => ({
  volumePriceDetails: [],
  selectedVolumePriceDetails: null,
  setVolumePriceDetails: (details: IVolumePriceDetails[]) =>
    set({ volumePriceDetails: details }),
  setSelectedVolumePriceDetails: (detail: IVolumePriceDetails | null) =>
    set({ selectedVolumePriceDetails: detail }), // Allow null here
  clearVolumePriceDetails: () => set({ volumePriceDetails: [] }),
}));

export default useVolumePriceStore;
