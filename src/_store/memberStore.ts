import { IMyInfo } from "@/_types";
import { create } from "zustand";

interface MemberState {
  memberInfo: IMyInfo | null;
  setMemberInfo: (data: IMyInfo) => void;
}

const useMemberStore = create<MemberState>((set) => ({
  memberInfo: null,
  setMemberInfo: (data) => set({ memberInfo: data }),
}));

export default useMemberStore;
