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
  setVolumePriceDetails: (details) => set({ volumePriceDetails: details }),
  setSelectedVolumePriceDetails: (detail: IVolumePriceDetails) =>
    set({ selectedVolumePriceDetails: detail }),
  clearVolumePriceDetails: () => set({ volumePriceDetails: [] }),
}));

export default useVolumePriceStore;
