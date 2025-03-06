export interface IMySpace {
  memberId: number;
  nickname: string;
  introduction: string;
  profileImage: string;
  myDailyLifeCount: number;
  myTastingNoteCount: number;
  savedTastingNoteCount: number;
  followingCount: number | null;
  followerCount: number | null;
  hasBadge: boolean;
}
