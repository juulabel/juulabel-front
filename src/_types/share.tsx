export interface ILifeList {
  title: string;
  content: string;
  dailyLifeId: number;
  memberInfo: {
    memberId: number;
    nickname: string;
    profileImage: null | string;
  };
  thumbnailPath: null | string;
  imageCount: number;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface ILifeDetail {
  dailyLifeDetailInfo: {
    title: string;
    content: string;
    dailyLifeId: number;
    memberInfo: {
      memberId: number;
      nickname: string;
      profileImage: string;
    };
    createdAt: string;
    commentCount: number;
    likeCount: number;
    isLiked: boolean;
  };
  dailyLifeImageInfo: {
    imageUrlList: string[];
    imageCount: number;
  };
}

export interface INoteThumbnail {
  noteId: string;
  alcoholType: string;
  alcoholThumbnail?: string;
  alcoholImageCount?: number;
  alcoholName: string;
  username: string;
  userImage: string;
  published: string;
}
