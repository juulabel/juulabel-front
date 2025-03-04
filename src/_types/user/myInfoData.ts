export interface IMyInfo {
  memberId: number;
  nickname: string;
  email: string;
  isNotificationsAllowed: boolean;
  introduction: string;
  profileImage: string | null;
  gender: string;
  alcoholTypeIds: number[];
}
