import { IMemberInfo } from "@/_types";
import { create } from "zustand";

interface MemberState {
  memberInfo: IMemberInfo | null;
  setMemberInfo: (data: IMemberInfo) => void;
}

const useMemberStore = create<MemberState>((set) => ({
  memberInfo: null,
  setMemberInfo: (data) => set({ memberInfo: data }),
}));

export default useMemberStore;
