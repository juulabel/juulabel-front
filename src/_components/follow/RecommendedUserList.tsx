"use client";

import { RecommendUserList } from "@/_types/user/recommendedUser";
import { UserItem } from "./UserItem";

// Constants defined outside component to prevent recreation

export default function RecommendedUserList({
  myId,
  recommendedUserList,
  showDeleteButton,
  debouncedSearchQuery,
  onBadgeClick,
  onDeleteClick,
}: RecommendUserList) {
  return (
    <div className="min-h-[200px]">
      {recommendedUserList.map((user, index) => (
        <UserItem
          key={index}
          user={user}
          myId={myId}
          debouncedSearchQuery={debouncedSearchQuery}
          isFirst={index === 0}
          isLast={index === recommendedUserList.length - 1}
          showDeleteButton={showDeleteButton}
          onBadgeClick={onBadgeClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
