export interface RecommendedUser {
  id: number;
  nickname: string;
  image: string;
  badge: string[];
  isFollowed: boolean;
}

export interface RecommendUserList {
  recommendedUserList: RecommendedUser[];
}
