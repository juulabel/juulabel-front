import { create } from "zustand";

interface IAgreementState {
  allAgree: boolean;
  serviceAgree: boolean;
  privateInformationAgree: boolean;
  marketingAgree: boolean;
  setAllAgree: (value: boolean) => void;
  setServiceAgree: (value: boolean) => void;
  setPrivateInformationAgree: (value: boolean) => void;
  setMarketingAgree: (value: boolean) => void; // Corrected typo from setMarketingAgre to setMarketingAgree
}

const useAgreementStore = create<IAgreementState>((set) => ({
  allAgree: false,
  serviceAgree: false,
  privateInformationAgree: false,
  marketingAgree: false,
  setAllAgree: (value: boolean) =>
    set((state) => ({
      allAgree: value,
      serviceAgree: value,
      privateInformationAgree: value,
      marketingAgree: value,
    })),
  setServiceAgree: (value: boolean) =>
    set((state) => ({
      serviceAgree: value,
      allAgree: value && state.privateInformationAgree && state.marketingAgree,
    })),
  setPrivateInformationAgree: (value: boolean) =>
    set((state) => ({
      privateInformationAgree: value,
      allAgree: state.serviceAgree && value && state.marketingAgree,
    })),
  setMarketingAgree: (value: boolean) =>
    set((state) => ({
      marketingAgree: value,
      allAgree: state.serviceAgree && state.privateInformationAgree && value,
    })),
}));

export default useAgreementStore;
