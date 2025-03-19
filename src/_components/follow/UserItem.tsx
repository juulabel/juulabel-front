import { RecommendedUser } from "@/_types/user/recommendedUser";
import { useCallback, memo, useMemo, useState } from "react";
import Image from "next/image";
import FollowButton from "@/_common/FollowButton";
import { useCommonFollow, useDeleteFollow } from "@/_utils/hooks/useFollow";
import { usePathname, useRouter } from "next/navigation";

const DEFAULT_PROFILE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;
const BADGE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`;

interface UserItemProps {
  userId: string;
  user: RecommendedUser;
  isFirst: boolean;
  isLast: boolean;
  showDeleteButton?: boolean;
  debouncedSearchQuery?: string;
  onBadgeClick: () => void;
  onDeleteClick?: ({
    userId,
    nickname,
  }: {
    userId: number;
    nickname: string;
  }) => void;
}

const UserItemComponent = ({
  userId,
  user,
  isFirst,
  isLast,
  showDeleteButton,
  debouncedSearchQuery,
  onBadgeClick,
  onDeleteClick,
}: UserItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);

  const isFollowerPath = pathname.includes("/follower");

  const { mutate: handleFollowButton } = useCommonFollow(
    userId,
    isFollowerPath,
  );

  const handleFollowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFollowed((prev) => !prev);
      handleFollowButton({
        id: user.id,
        nickname: user.nickname,
        isFollowed,
      });
    },
    [handleFollowButton, user.id, user.nickname],
  );

  const handleProfileClick = useCallback(() => {
    router.push(`/user/profile/${user.id}`);
  }, [user.id, router]);

  const borderClasses = useMemo(() => {
    return `flex cursor-pointer flex-row items-center justify-between border-b-[1px] border-t-[1px] transition hover:bg-cool-grayscale-100 ${
      isFirst ? "border-t-cool-grayscale-200" : "border-t-cool-grayscale-50"
    } ${isLast ? "border-b-cool-grayscale-200" : "border-b-cool-grayscale-50"}`;
  }, [isFirst, isLast]);

  const renderHighlightedName = useCallback(
    (nickname: string) => {
      if (!debouncedSearchQuery) return nickname;

      const index = nickname
        .toLowerCase()
        .indexOf(debouncedSearchQuery.toLowerCase());
      return index === -1 ? (
        nickname
      ) : (
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
              onClick={(e) => {
                e.stopPropagation();
                onBadgeClick();
              }}
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
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick?.({
                userId: user.id,
                nickname: user.nickname,
              });
            }}
            className="mr-4 items-center justify-center text-xs font-medium text-slate-500"
          >
            삭제
          </button>
        )}
        <FollowButton
          width="18"
          isFollowed={isFollowed}
          textSize="xs"
          onChangeFollow={handleFollowClick}
          showDeleteButton={showDeleteButton}
        />
      </div>
    </div>
  );
};

export const UserItem = memo(UserItemComponent);
