"use client";

import { RecommendUserList } from "@/_types/user/recommendedUser";
import { UserItem } from "./UserItem";

// Constants defined outside component to prevent recreation

export default function RecommendedUserList({
  userId,
  recommendedUserList,
  showDeleteButton,
  debouncedSearchQuery,
  onBadgeClick,
}: RecommendUserList) {
  return (
    <div className="min-h-[200px]">
      {recommendedUserList.map((user, index) => (
        <UserItem
          key={index}
          user={user}
          userId={userId}
          debouncedSearchQuery={debouncedSearchQuery}
          isFirst={index === 0}
          isLast={index === recommendedUserList.length - 1}
          showDeleteButton={showDeleteButton}
          onBadgeClick={onBadgeClick}
        />
      ))}
    </div>
  );
}
