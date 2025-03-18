import { RecommendedUser } from "@/_types/user/recommendedUser";
import { useCallback, memo, useMemo, useState } from "react";
import Image from "next/image";
import FollowButton from "@/_common/FollowButton";
import {
  DeleteButtonMutateParams,
  FollowButtonMutateParams,
} from "./RecommendedUserList";

const DEFAULT_PROFILE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;
const BADGE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`;

export const UserItem = memo(
  ({
    user,
    isFirst,
    isLast,
    isCurrentUser,
    onProfileClick,
    onFollowButton,
    onDeleteButton,
    debouncedSearchQuery,
  }: {
    user: RecommendedUser;
    isFirst: boolean;
    isLast: boolean;
    isCurrentUser?: boolean;
    onProfileClick: (id: number) => void;
    onFollowButton: (params: FollowButtonMutateParams) => void;
    onDeleteButton: (params: DeleteButtonMutateParams) => void;
    debouncedSearchQuery?: string;
  }) => {
    const [isFollowed, setIsFollowed] = useState(user.isFollowed);

    const handleProfileClick = useCallback(() => {
      onProfileClick(user.id);
    }, [onProfileClick, user.id]);

    const handleFollowClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowed((prev) => !prev);
        onFollowButton({
          id: user.id,
          nickname: user.nickname,
          isFollowed,
        });
      },
      [onFollowButton, user.id, user.nickname, isFollowed],
    );

    const handleDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteButton({ id: user.id });
      },
      [onDeleteButton, user.id],
    );

    const borderClasses = useMemo(() => {
      const topClass = isFirst
        ? "border-t-cool-grayscale-200"
        : "border-t-cool-grayscale-50";
      const bottomClass = isLast
        ? "border-b-cool-grayscale-200"
        : "border-b-cool-grayscale-50";
      return `flex cursor-pointer flex-row items-center justify-between border-b-[1px] border-t-[1px] transition hover:bg-cool-grayscale-100 ${topClass} ${bottomClass}`;
    }, [isFirst, isLast]);

    const renderHighlightedName = useCallback(
      (nickname: string) => {
        if (!debouncedSearchQuery) return nickname;

        const index = nickname
          .toLowerCase()
          .indexOf(debouncedSearchQuery.toLowerCase());
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
          {isCurrentUser && (
            <button
              onClick={handleDeleteClick}
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
            isCurrentUser={isCurrentUser}
          />
        </div>
      </div>
    );
  },
);
