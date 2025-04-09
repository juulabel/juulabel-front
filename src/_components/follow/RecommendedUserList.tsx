"use client";

import { RecommendUserList } from "@/_types/user/recommendedUser";
import { UserItem } from "./UserItem";

// Constants defined outside component to prevent recreation

export default function RecommendedUserList({
  recommendedUserList,
  debouncedSearchQuery,
  onBadgeClick,
  onDeleteClick,
  type,
}: RecommendUserList) {
  return (
    <div className="min-h-[200px]">
      {recommendedUserList.map((user, index) => (
        <UserItem
          key={index}
          type={type}
          user={user}
          debouncedSearchQuery={debouncedSearchQuery}
          isFirst={index === 0}
          isLast={index === recommendedUserList.length - 1}
          onBadgeClick={onBadgeClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
