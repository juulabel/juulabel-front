import { RecommendedUser } from "@/_types/user/recommendedUser";
import { useCallback, memo, useState } from "react";
import Image from "next/image";
import FollowButton from "@/_common/FollowButton";
import { useCommonFollow } from "@/_utils/hooks/useFollow";
import { usePathname, useRouter } from "next/navigation";
import useMemberStore from "@/_store/memberStore";

const DEFAULT_PROFILE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;
const BADGE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`;

interface UserItemProps {
  user: RecommendedUser;
  isFirst: boolean;
  isLast: boolean;
  debouncedSearchQuery?: string;
  type: "following" | "follower" | "recommendation";
  onBadgeClick: () => void;
  onDeleteClick?: (targetUser: RecommendedUser) => void;
}

const UserItemComponent = ({
  user,
  isFirst,
  isLast,
  debouncedSearchQuery,
  type,
  onBadgeClick,
  onDeleteClick,
}: UserItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);
  const { memberInfo } = useMemberStore();

  const currentMemberId = memberInfo?.memberId?.toString() || "";
  const pathUserId = pathname.split("/")[3];
  const isCurrentUserProfile = currentMemberId === pathUserId;
  const isOwnProfile = currentMemberId !== user.id.toString();

  const { mutate: handleFollowButton } = useCommonFollow(
    pathUserId ?? currentMemberId,
    type,
  );

  const handleFollowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFollowed((prev) => {
        handleFollowButton({
          targetUserId: user.id.toString(),
          nickname: user.nickname,
          isFollowed: prev,
        });
        return !prev;
      });
    },
    [handleFollowButton, user],
  );

  const handleProfileClick = useCallback(() => {
    router.push(`/user/profile/${user.id}`);
  }, [user.id, router]);

  const handleBadgeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onBadgeClick();
    },
    [onBadgeClick],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDeleteClick?.(user);
    },
    [onDeleteClick, user],
  );

  const borderClasses = `flex cursor-pointer flex-row items-center justify-between border-b-[1px] border-t-[1px] transition hover:bg-cool-grayscale-100 ${
    isFirst ? "border-t-cool-grayscale-200" : "border-t-cool-grayscale-50"
  } ${isLast ? "border-b-cool-grayscale-200" : "border-b-cool-grayscale-50"}`;

  const renderHighlightedName = useCallback(
    (nickname: string) => {
      if (!debouncedSearchQuery) return nickname;

      const lowerNickname = nickname.toLowerCase();
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      const index = lowerNickname.indexOf(lowerQuery);

      if (index === -1) return nickname;

      return (
        <>
          {nickname.slice(0, index)}
          <span className="text-primary-700">
            {nickname.slice(index, index + debouncedSearchQuery.length)}
          </span>
          {nickname.slice(index + debouncedSearchQuery.length)}
        </>
      );
    },
    [debouncedSearchQuery],
  );

  const showDeleteButton = isCurrentUserProfile && type === "follower";
  const showFollowButton = isOwnProfile;

  return (
    <div className={borderClasses} onClick={handleProfileClick}>
      <div className="mx-[4%] my-3 flex items-center">
        <Image
          src={user.profileImage || DEFAULT_PROFILE_IMAGE}
          width={48}
          height={48}
          alt="유저 이미지"
          className="mr-4 flex h-[48px] w-[48px] rounded-full"
        />
        <div className="ml-2 flex flex-row items-center gap-2">
          <p>{renderHighlightedName(user.nickname)}</p>
          {user.hasBadge && (
            <Image
              onClick={handleBadgeClick}
              src={BADGE_IMAGE}
              alt="배지"
              className="ml-1"
              width={28}
              height={28}
            />
          )}
        </div>
      </div>
      <div className="mr-[4%] flex flex-row whitespace-nowrap">
        {showDeleteButton && (
          <button
            onClick={handleDeleteClick}
            className="mr-4 items-center justify-center text-xs font-medium text-slate-500"
          >
            삭제
          </button>
        )}
        {showFollowButton && (
          <FollowButton
            width="18"
            isFollowed={isFollowed}
            textSize="xs"
            onChangeFollow={handleFollowClick}
            isMySpace={showDeleteButton}
          />
        )}
      </div>
    </div>
  );
};

export const UserItem = memo(UserItemComponent);
