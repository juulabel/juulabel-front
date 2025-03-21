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
  dailyLifeDetailInfo: ILifeDetailInfo;
  imageInfo: {
    imageUrlList: string[];
    imageCount: number;
  };
}

export interface ILifeDetailInfo {
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

export interface IAlcoholDetailResponse {
  success: boolean;
  message: string;
  result: {
    alcoholicDrinksDetailInfo: IAlcoholicDrinksDetailInfo;
    volumePriceDetails: IVolumePriceDetail[];
    ingredientSummary: IIngredient[];
    tastingNoteSensorSummary: ITastingNoteSensorSummary;
    tastingNoteSummary: unknown[]; // 모르겠음
  };
}

export interface IAlcoholicDrinksDetailInfo {
  id: number;
  name: string;
  thumbnail: string;
  alcoholContent: number;
  alcoholicVolume: number;
  discountPrice: number;
  regularPrice: number;
  rating: number;
  tastingNoteCount: number;
  alcoholType: {
    id: number;
    name: string;
  };
  brewery: {
    id: number;
    name: string;
    region: string;
    message: string;
  };
}

export interface IVolumePriceDetail {
  volume: number;
  discountPrice: number;
  regularPrice: number;
}

export interface IIngredient {
  id: number;
  name: string;
}

export interface ITastingNoteSensorSummary {
  tastingNoteId: number;
  rgb: string;
  scent: string[];
  flavor: IFlavor[];
  sensory: ISensory[];
}

export interface IFlavor {
  name: string;
  score: number;
}

export interface ISensory {
  name: string;
  score: number;
  id: number;
}
