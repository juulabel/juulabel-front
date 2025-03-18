import { IPaginatedData, IUserProfileData } from "@/_types";
import { RecommendedUser } from "@/_types/user/recommendedUser";
import { deleteFollower } from "@/app/api/user/follow/deleteFollower";
import { followUser } from "@/app/api/user/follow/followUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "react-toastify";

export function useProfileFollow(
  userId: string,
  isFollowed?: boolean,
  nickname?: string,
) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => followUser(userId),
    onMutate: async () => {
      queryClient.setQueryData(
        ["user", userId],
        (oldData: { isFollowed: boolean; followerCount: number }) => {
          if (!oldData) return oldData;
          const newIsFollowed = !oldData.isFollowed;
          return {
            ...oldData,
            isFollowed: newIsFollowed,
            followerCount: oldData.followerCount + (newIsFollowed ? 1 : -1),
          };
        },
      );
    },
    onSuccess: () => {
      if (!nickname) return;
      toast(
        isFollowed
          ? `${nickname}님을 팔로우 취소했어요.`
          : `${nickname}님을 팔로우했어요.`,
      );
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: () => {
      toast.error("팔로우 상태 변경에 실패했습니다.");
    },
  });

  return { mutate };
}

// Shared utility functions for cache updates
const updateUserListCache = (
  oldData: IPaginatedData | RecommendedUser[] | undefined,
  id: number,
  isFollowed: boolean,
) => {
  if (!oldData) return oldData;

  if ("pages" in oldData) {
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        content: page.content.map((user) =>
          user.id === id ? { ...user, isFollowed: !isFollowed } : user,
        ),
      })),
    };
  }

  return (oldData as RecommendedUser[]).map((user) =>
    user.id === id ? { ...user, isFollowed: !isFollowed } : user,
  );
};

const updateFollowCounts = (
  oldData: IUserProfileData | undefined,
  isFollowed: boolean,
  isFollowerPath: boolean,
) => {
  if (!oldData) return oldData;

  const delta = isFollowed ? -1 : 1;

  return {
    ...oldData,
    followingCount: isFollowerPath
      ? oldData.followingCount
      : oldData.followingCount + delta,
    followerCount: isFollowerPath
      ? oldData.followerCount + delta
      : oldData.followerCount,
  };
};

export function useCommonFollow(userId: string, isFollowerPath: boolean) {
  const queryClient = useQueryClient();

  type FollowButtonMutateParams = {
    id: number;
    nickname: string;
    isFollowed: boolean;
  };

  const { mutate } = useMutation({
    mutationFn: ({ id }: FollowButtonMutateParams) => followUser(id.toString()),
    onMutate: async ({ id, nickname, isFollowed }) => {
      // Update the user profile cache
      queryClient.setQueryData(
        ["user", userId],
        (oldData: IUserProfileData | undefined) =>
          updateFollowCounts(oldData, isFollowed, isFollowerPath),
      );

      // Update the follower/following list cache
      const queryKey = [isFollowerPath ? "follower" : "following", userId];
      queryClient.setQueryData(
        queryKey,
        (oldData: IPaginatedData | RecommendedUser[] | undefined) =>
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
      toast.error("팔로우 처리 중 오류가 발생했어요.");
      console.error("팔로우 처리 중 오류가 발생했습니다.", error);
    },
  });

  return { mutate };
}

export type DeleteButtonMutateParams = {
  id: number;
};

export function useDeleteFollow(userId: string) {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteButton } = useMutation({
    mutationFn: ({ id }: DeleteButtonMutateParams) =>
      deleteFollower(id.toString()),
    onMutate: async ({ id }) => {
      // Update the follower list cache
      queryClient.setQueryData(
        ["follower", userId],
        (oldData: IPaginatedData | RecommendedUser[] | undefined) => {
          if (!oldData) return oldData;

          if ("pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.filter((user) => user.id !== id),
              })),
            };
          }

          return (oldData as RecommendedUser[]).filter(
            (user) => user.id !== id,
          );
        },
      );

      // Update follower count in user profile
      queryClient.setQueryData(
        ["user", userId],
        (oldData: IUserProfileData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            followerCount: Math.max(0, oldData.followerCount - 1),
          };
        },
      );

      return { id };
    },
    onError: (error) => {
      console.error("팔로워 삭제 중 오류가 발생했습니다.", error);
    },
  });

  return { mutate: handleDeleteButton };
}
