export interface RecommendedUser {
  id: number;
  nickname: string;
  profileImage: string;
  isFollowed: boolean;
  hasBadge: boolean;
}

export interface RecommendUserList {
  type: "following" | "follower" | "recommendation";
  recommendedUserList: RecommendedUser[];
  showDeleteButton?: boolean;
  debouncedSearchQuery?: string;
  onBadgeClick: () => void;
  onDeleteClick?: (targetUser: RecommendedUser) => void;
}
