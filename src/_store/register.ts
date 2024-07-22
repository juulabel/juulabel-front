import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IRegisterUserState {
  allAgree: boolean;
  serviceAgree: {
    termsId: number;
    isAgreed: boolean;
  };
  privateInformationAgree: {
    termsId: number;
    isAgreed: boolean;
  };
  marketingAgree: {
    termsId: number;
    isAgreed: boolean;
  };
  nickname: string;
  email: string;
  provider: string;
  providerId: string;
  gender: string;
  genderCheck: boolean;
  preferredAlcoholType: string[];
  setAllAgree: (value: boolean) => void;
  setServiceAgree: (value: boolean) => void;
  setPrivateInformationAGree: (value: boolean) => void;
  setMarketingAgree: (value: boolean) => void;
  setNickname: (value: string) => void;
  setEmail: (value: string) => void;
  setProvider: (value: string) => void;
  setProviderId: (value: string) => void;
  setGender: (value: string) => void;
  setGendercheck: (value: boolean) => void;
  setPreferredAlcoholType: (value: string[]) => void;
}

export const useRegisterStore = create(
  persist<IRegisterUserState>(
    (set) => ({
      allAgree: false,
      serviceAgree: {
        termsId: 1,
        isAgreed: false,
      },
      privateInformationAgree: {
        termsId: 2,
        isAgreed: false,
      },
      marketingAgree: {
        termsId: 3,
        isAgreed: false,
      },
      nickname: "",
      email: "",
      provider: "",
      providerId: "",
      gender: "",
      genderCheck: false,
      preferredAlcoholType: [],
      setAllAgree: (value: boolean) =>
        set((state) => ({ ...state, allAgree: value })),
      setServiceAgree: (value: boolean) =>
        set((state) => ({
          ...state,
          serviceAgree: {
            termsId: 1,
            isAgreed: value,
          },
        })),
      setPrivateInformationAGree: (value: boolean) =>
        set((state) => ({
          ...state,
          privateInformationAgree: {
            termsId: 2,
            isAgreed: value,
          },
        })),
      setMarketingAgree: (value: boolean) =>
        set((state) => ({
          ...state,
          marketingAgree: {
            termsId: 3,
            isAgreed: value,
          },
        })),
      setNickname: (value: string) =>
        set((state) => ({ ...state, nickname: value })),
      setEmail: (value: string) => set((state) => ({ ...state, email: value })),
      setProvider: (value: string) =>
        set((state) => ({ ...state, provider: value })),
      setProviderId: (value: string) =>
        set((state) => ({ ...state, providerId: value })),
      setGender: (value: string) =>
        set((state) => ({ ...state, gender: value })),
      setGendercheck: (value: boolean) =>
        set((state) => ({ ...state, genderCheck: value })),
      setPreferredAlcoholType: (value: string[]) => {
        set((state) => ({ ...state, preferredAlcoholType: value }));
      },
    }),
    {
      name: "userRegisterStorage",
    },
  ),
);
