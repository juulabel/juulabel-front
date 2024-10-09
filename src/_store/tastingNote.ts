import { create } from "zustand";
import { persist } from "zustand/middleware";

// 전통주 세부 정보 (alcoholicDrinksDetails)
interface IAlocoholicDrinksDetails {
  alcoholicDrinksName: string; // 전통주명
  alcoholContent: number; //전통주 도수
  alcoholTypeName: string; // 주종명
  breweryName: string; //양조장 이름
  breweryRegion: string; //양조장 지역
}

interface ITastingNoteInformation {
  alcoholicDrinksDetails: IAlocoholicDrinksDetails;
  alcoholTypeId: number; // 주종 고유 번호
  alcoholicDrinksId: number; // 전통주 고유 번호
  colorId: number; // 색상 고유 번호
  scentIds: number[]; //향 고유 번호 리스트
  sensoryLevelIds: number[]; // 촉각 고유 번호 리스트
  flavorLevelIds: number[]; //맛 고유 번호 리스트
  content: string; //부연 설명
  isPrivate: boolean; //비공개 여부
  rating: number; //달점

  setAlcoholicDrinksName: (value: string) => void;
  setAlcoholContent: (value: number) => void;
  setAlcoholTypeName: (value: string) => void;
  setBreweryName: (value: string) => void;
  setBreweryRegion: (value: string) => void;
  setAlcoholTypeId: (value: number) => void;
  setAlcoholicDrinksId: (value: number) => void;
  setColorId: (value: number) => void;
  setScentIds: (scentIds: number[]) => void;
  setSensoryLevelIds: (sensoryLevelIds: number[]) => void;
  setFlavorLevelIds: (flavorLevelIds: number[]) => void;
  setContent: (value: string) => void;
  setIsPrivate: (value: boolean) => void;
  setRating: (value: number) => void;
}

export const useTastingNoteInformationStore = create(
  persist<ITastingNoteInformation>(
    (set) => ({
      alcoholicDrinksDetails: {
        alcoholTypeName: "",
        alcoholicDrinksName: "",
        alcoholContent: 0,
        breweryName: "",
        breweryRegion: "",
      },
      alcoholTypeId: 0,
      alcoholicDrinksId: 0,
      colorId: 0,
      scentIds: [],
      sensoryLevelIds: [],
      flavorLevelIds: [],
      content: "",
      isPrivate: false,
      rating: 0,

      setAlcoholTypeName: (value: string) =>
        set((state) => ({
          ...state,
          alcoholicDrinksDetails: {
            ...state.alcoholicDrinksDetails,
            alcoholTypeName: value,
          },
        })),
      setAlcoholicDrinksName: (value: string) =>
        set((state) => ({
          ...state,
          alcoholicDrinksDetails: {
            ...state.alcoholicDrinksDetails,
            alcoholicDrinksName: value,
          },
        })),
      setAlcoholContent: (value: number) =>
        set((state) => ({
          ...state,
          alcoholicDrinksDetails: {
            ...state.alcoholicDrinksDetails,
            alcoholContent: value,
          },
        })),
      setBreweryName: (value: string) =>
        set((state) => ({
          ...state,
          alcoholicDrinksDetails: {
            ...state.alcoholicDrinksDetails,
            breweryName: value,
          },
        })),
      setBreweryRegion: (value: string) =>
        set((state) => ({
          ...state,
          alcoholicDrinksDetails: {
            ...state.alcoholicDrinksDetails,
            breweryRegion: value,
          },
        })),
      setAlcoholTypeId: (value: number) =>
        set((state) => ({ ...state, alcoholTypeId: value })),
      setAlcoholicDrinksId: (value: number) =>
        set((state) => ({ ...state, alcoholicDrinksId: value })),
      setColorId: (value: number) =>
        set((state) => ({ ...state, colorId: value })),
      setScentIds: (scentIds: number[]) =>
        set((state) => ({ ...state, scentIds })),
      setSensoryLevelIds: (sensoryLevelIds: number[]) =>
        set((state) => ({ ...state, sensoryLevelIds })),
      setFlavorLevelIds: (flavorLevelIds: number[]) =>
        set((state) => ({ ...state, flavorLevelIds })),
      setContent: (value: string) =>
        set((state) => ({ ...state, content: value })),
      setIsPrivate: (value: boolean) =>
        set((state) => ({ ...state, isPrivate: value })),
      setRating: (value: number) =>
        set((state) => ({ ...state, rating: value })),
    }),
    { name: "TastingNoteInformationStorage" },
  ),
);
