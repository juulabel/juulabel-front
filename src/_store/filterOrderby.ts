import { create } from "zustand";

export const filterList: Record<string, string>[] = [
  {
    "1": "가나다 순",
  },
  {
    "2": "달점 높은 순",
  },
  {
    "3": "리뷰 많은 순",
  },
  {
    "4": "높은 가격 순",
  },
  {
    "5": "낮은 가격순",
  },
];

interface FilterOrderByStore {
  selectedFilterOrderBy: Record<string, string>;
  setSelectedFilterOrderBy: (orderBy: Record<string, string>) => void;
}

const useFilterOrderByStore = create<FilterOrderByStore>((set) => ({
  selectedFilterOrderBy: filterList[0],
  setSelectedFilterOrderBy: (orderBy) =>
    set({ selectedFilterOrderBy: orderBy }),
}));

export default useFilterOrderByStore;
