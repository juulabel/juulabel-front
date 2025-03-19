export interface RecommendedUser {
  id: number;
  nickname: string;
  profileImage: string;
  isFollowed: boolean;
  hasBadge: boolean;
}

export interface RecommendUserList {
  myId: string;
  recommendedUserList: RecommendedUser[];
  showDeleteButton?: boolean;
  debouncedSearchQuery?: string;
  onBadgeClick: () => void;
  onDeleteClick?: ({
    targetUserId,
    nickname,
  }: {
    targetUserId: number;
    nickname: string;
  }) => void;
}
