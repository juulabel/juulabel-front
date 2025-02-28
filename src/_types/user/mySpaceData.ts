export interface IMySpace {
  nickname: string;
  introduction: string;
  profileImage: string;
  myDailyLifeCount: number;
  myTastingNoteCount: number;
  savedTastingNoteCount: number;
  followingCount: number | null;
  followerCount: number | null;
  documents: number | null;
}
