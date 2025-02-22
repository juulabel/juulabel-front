export interface IMySpace {
  nickname: string;
  introduction: string;
  profileImage: string;
  myDailyLifeCount: number;
  myTastingNoteCount: number;
  savedTastingNoteCount: number;
  followings: number | null;
  followers: number | null;
  documents: number | null;
}
