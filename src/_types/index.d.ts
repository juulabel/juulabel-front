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
