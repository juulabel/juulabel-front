import { create } from "zustand";

interface ReportStore {
  reportId: string;
  setReportId: (id: string) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  reportId: "",
  setReportId: (id) => set({ reportId: id }),
}));
