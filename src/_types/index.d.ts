import { ComponentPropsWithoutRef, ReactNode } from "react";

export type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type PolymorphicPropsWithoutRef<C extends ElementType, V> = {
  as?: C;
  children: ReactNode;
  variant?: V;
} & ComponentPropsWithoutRef<C>;

export type MemberInfo = IMemberInfo & Partial<IAdditionalMemberInfo>;

export interface IAdditionalMemberInfo {
  email: string;
  isNotificationsAllowed: boolean;
  introduction: string;
  profileImage: string;
  gender: string;
  alcoholTypeIds: number[];
}

interface IMemberInfo {
  memberId: number;
  nickname: string;
  profileImage: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  result: T;
}

export interface ITastingNoteDetailInfo {
  tastingNoteId: number;
  memberInfo: IMemberInfo;
  createdAt: string;
  alcoholicDrinksName: string;
  alcoholTypeName: string;
  alcoholContent: number;
  breweryName: string;
  rgbColor: string;
  content: string;
  rating: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface IImageInfo {
  imageUrlList: string[];
  imageCount: number;
}

export interface ITastingNoteResponse {
  tastingNoteDetailInfo: ITastingNoteDetailInfo;
  sensoryLevelIds: number[];
  scentIds: number[];
  flavorLevelIds: number[];
  imageInfo: IImageInfo;
}

// 전통주 세부 정보
interface IAlocoholicDrinksDetails {
  alcoholicDrinksName: string; // 전통주명
  alcoholContent: number; //전통주 도수
  alcoholTypeName: string; // 주종명
  breweryName: string; //양조장 이름
  breweryRegion: string; //양조장 지역
}

export interface ITastingNoteWriteRequest {
  alcoholicDrinksDetails: IAlocoholicDrinksDetails;
  alcoholTypeId: number; // 주종 고유 번호
  alcoholicDrinksId?: number; // 전통주 고유 번호
  colorId: number; // 색상 고유 번호
  scentIds: number[]; //향 고유 번호 리스트
  sensoryLevelIds: number[]; // 촉각 고유 번호 리스트
  flavorLevelIds: number[]; //맛 고유 번호 리스트
  content: string; //부연 설명
  isPrivate: boolean; //비공개 여부
  rating: number; //달점
}

export interface ITastingNoteRequest {
  request: ITastingNoteWriteRequest;
  files?: File[];
}

interface IComment {
  content: string;
  commentId: number;
  memberInfo: IMemberInfo;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
}

interface ISort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface IPageable {
  offset: number;
  sort: ISort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

interface ITastingNoteCommentSummaries {
  size: number;
  content: IComment[];
  number: number;
  sort: ISort;
  numberOfElements: number;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface IComment {
  content: string;
  commentId: number;
  memberInfo: MemberInfo;
  createdAt: string; // ISO 날짜 문자열인거 같음 체크필요
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  isDeleted: boolean;
}

type IReply = Omit<IComment, "replyCount">;
