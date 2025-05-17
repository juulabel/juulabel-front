import { create } from "zustand";
import { IMyInfo } from "@/_types";

interface MemberState {
  memberInfo: IMyInfo | null;
  setMemberInfo: (data: IMyInfo) => void;
}

const useMemberStore = create<MemberState>((set) => ({
  memberInfo: null,
  setMemberInfo: (data) => set({ memberInfo: data }),
}));

export default useMemberStore;
