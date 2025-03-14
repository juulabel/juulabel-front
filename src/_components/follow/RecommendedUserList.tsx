"use client";

import FollowButton from "@/_common/FollowButton";
import {
  RecommendedUser,
  RecommendUserList,
} from "@/_types/user/recommendedUser";
import { deleteFollower } from "@/app/api/user/follow/deleteFollower";
import { followUser } from "@/app/api/user/follow/followUser";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, memo, useMemo } from "react";
import { toast } from "react-toastify";

// Constants defined outside component to prevent recreation
const DEFAULT_PROFILE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;
const BADGE_IMAGE = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`;

type FollowButtonMutateParams = {
  id: number;
  nickname: string;
  isFollowed: boolean;
};

type DeleteButtonMutateParams = {
  id: number;
};

// Define types for user profile data
interface UserProfileData {
  followingCount: number;
  followerCount: number;
  [key: string]: unknown;
}

// Define types for paginated data
interface PaginatedData {
  pages: Array<{
    content: RecommendedUser[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

const UserItem = memo(
  ({
    user,
    isFirst,
    isLast,
    isCurrentUser,
    onProfileClick,
    onFollowButton,
    onDeleteButton,
  }: {
    user: RecommendedUser;
    isFirst: boolean;
    isLast: boolean;
    isCurrentUser?: boolean;
    onProfileClick: (id: number) => void;
    onFollowButton: (params: FollowButtonMutateParams) => void;
    onDeleteButton: (params: DeleteButtonMutateParams) => void;
  }) => {
    const handleProfileClick = useCallback(() => {
      onProfileClick(user.id);
    }, [onProfileClick, user.id]);

    const handleFollowClick = useCallback(() => {
      onFollowButton({
        id: user.id,
        nickname: user.nickname,
        isFollowed: user.isFollowed,
      });
    }, [onFollowButton, user.id, user.nickname, user.isFollowed]);

    const handleDeleteClick = useCallback(() => {
      onDeleteButton({ id: user.id });
    }, [onDeleteButton, user.id]);

    const borderClasses = useMemo(() => {
      const topClass = isFirst
        ? "border-t-cool-grayscale-200"
        : "border-t-cool-grayscale-50";
      const bottomClass = isLast
        ? "border-b-cool-grayscale-200"
        : "border-b-cool-grayscale-50";
      return `flex cursor-pointer flex-row items-center justify-between border-b-[1px] border-t-[1px] transition hover:bg-cool-grayscale-100 ${topClass} ${bottomClass}`;
    }, [isFirst, isLast]);

    return (
      <div
        className={borderClasses}
        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
          event.stopPropagation()
        }
      >
        <div
          className="mx-[4%] my-2 flex items-center"
          onClick={handleProfileClick}
        >
          <Image
            src={user.profileImage || DEFAULT_PROFILE_IMAGE}
            width={48}
            height={48}
            alt="유저 이미지"
            className="mr-4 flex rounded-full"
          />
          <div className="flex items-center">
            <span>{user.nickname}</span>
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
            isFollowed={user.isFollowed}
            textSize="xs"
            onChangeFollow={handleFollowClick}
            isCurrentUser={isCurrentUser}
          />
        </div>
      </div>
    );
  },
);

UserItem.displayName = "UserItem";

export default function RecommendedUserList({
  recommendedUserList,
  isCurrentUser,
  userId,
  isFollower,
}: RecommendUserList) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateFollowCounts = useCallback(
    (oldData: UserProfileData | undefined, id: number, isFollowed: boolean) => {
      if (!oldData) return oldData;

      const newFollowingCount =
        !isFollower && isFollowed
          ? oldData.followingCount - 1
          : !isFollower && !isFollowed
            ? oldData.followingCount + 1
            : oldData.followingCount;

      const newFollowerCount =
        isFollower && isFollowed
          ? oldData.followerCount - 1
          : isFollower && !isFollowed
            ? oldData.followerCount + 1
            : oldData.followerCount;

      return {
        ...oldData,
        followingCount: newFollowingCount,
        followerCount: newFollowerCount,
      };
    },
    [isFollower],
  );

  const updateUserListCache = useCallback(
    (
      oldData: PaginatedData | RecommendedUser[] | undefined,
      id: number,
      isFollowed: boolean,
    ) => {
      if (!oldData) return oldData;

      if ('pages' in oldData) {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((user: RecommendedUser) =>
              user.id === id ? { ...user, isFollowed: !isFollowed } : user,
            ),
          })),
        };
      }

      return (oldData as RecommendedUser[]).map((user: RecommendedUser) =>
        user.id === id ? { ...user, isFollowed: !isFollowed } : user,
      );
    },
    [],
  );

  const { mutate: handleFollowButton } = useMutation({
    mutationFn: ({ id }: FollowButtonMutateParams) => followUser(id.toString()),
    onMutate: async ({ id, nickname, isFollowed }) => {
      // Update the user profile cache
      queryClient.setQueryData(["user", userId], (oldData: UserProfileData | undefined) =>
        updateFollowCounts(oldData, id, isFollowed),
      );

      // Update the follower/following list cache
      const queryKey = [isFollower ? "follower" : "following", userId];
      queryClient.setQueryData(queryKey, (oldData: PaginatedData | RecommendedUser[] | undefined) =>
        updateUserListCache(oldData, id, isFollowed),
      );

      return { id, nickname, isFollowed };
    },
    onSuccess: (_, { nickname, isFollowed }) => {
      toast(
        isFollowed
          ? `${nickname}님을 팔로우 취소했어요.`
          : `${nickname}님을 팔로우했어요.`,
      );
    },
    onError: (error) => {
      console.error("팔로우 처리 중 오류가 발생했습니다.", error);
    },
  });

  const handleProfileClick = useCallback(
    (userId: number) => {
      router.push(`/user/profile/${userId}`);
    },
    [router],
  );

  const { mutate: handleDeleteButton } = useMutation({
    mutationFn: ({ id }: DeleteButtonMutateParams) =>
      deleteFollower(id.toString()),
    onMutate: async ({ id }) => {
      // Update the follower list cache
      queryClient.setQueryData(["follower", userId], (oldData: PaginatedData | RecommendedUser[] | undefined) => {
        if (!oldData) return oldData;

        if ('pages' in oldData) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.filter(
                (user: RecommendedUser) => user.id !== id,
              ),
            })),
          };
        }

        return (oldData as RecommendedUser[]).filter((user: RecommendedUser) => user.id !== id);
      });

      // Update follower count in user profile
      queryClient.setQueryData(["user", userId], (oldData: UserProfileData | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          followerCount: Math.max(0, oldData.followerCount - 1),
        };
      });

      return { id };
    },
    onError: (error) => {
      console.error("팔로워 삭제 중 오류가 발생했습니다.", error);
    },
  });

  return (
    <div className="mb-8">
      {recommendedUserList.map((user: RecommendedUser, index: number) => (
        <UserItem
          key={user.id}
          user={user}
          isFirst={index === 0}
          isLast={index === recommendedUserList.length - 1}
          isCurrentUser={isCurrentUser}
          onProfileClick={handleProfileClick}
          onFollowButton={handleFollowButton}
          onDeleteButton={handleDeleteButton}
        />
      ))}
    </div>
  );
}
