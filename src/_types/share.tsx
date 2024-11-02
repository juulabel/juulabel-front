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
  imageInfo: {
    imageUrlList: string[];
    imageCount: number;
  };
}

export interface INoteThumbnail {
  TastingNoteId: number;
  alcoholicDrinksName: string;
  memberInfo: {
    memberId: number;
    nickname: string;
    profileImage: null | string;
  };
  thumbnailPath: null | string;
  alcoholTypeName: string;
  createdAt: string;
  hasMultipleImages: boolean;
  isPrivate: boolean;
}
