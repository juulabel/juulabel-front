export interface RecommendedUser {
  id: number;
  nickname: string;
  profileImage: string;  
  isFollowed: boolean;
  hasBadge: boolean;
}

export interface RecommendUserList {
  recommendedUserList: RecommendedUser[];
}
