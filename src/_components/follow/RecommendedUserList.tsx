"use client";

import { IPaginatedData, IUserProfileData } from "@/_types";
import {
  RecommendedUser,
  RecommendUserList,
} from "@/_types/user/recommendedUser";
import { deleteFollower } from "@/app/api/user/follow/deleteFollower";
import { followUser } from "@/app/api/user/follow/followUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, memo, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { UserItem } from "./UserItem";
import { log } from "console";

// Constants defined outside component to prevent recreation

type FollowButtonMutateParams = {
  id: number;
  nickname: string;
  isFollowed: boolean;
};

type DeleteButtonMutateParams = {
  id: number;
};

export default function RecommendedUserList({
  recommendedUserList,
  isCurrentUser,
  userId,
  isFollower,
  debouncedSearchQuery,
}: RecommendUserList) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateFollowCounts = useCallback(
    (
      oldData: IUserProfileData | undefined,
      id: number,
      isFollowed: boolean,
    ) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        followingCount: !isFollower
          ? oldData.followingCount + (isFollowed ? -1 : 1)
          : oldData.followingCount,
        followerCount: isFollower
          ? oldData.followerCount + (isFollowed ? -1 : 1)
          : oldData.followerCount,
      };
    },
    [isFollower],
  );

  const updateUserListCache = useCallback(
    (
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
    },
    [],
  );

  const { mutate: handleFollowButton } = useMutation({
    mutationFn: ({ id }: FollowButtonMutateParams) => followUser(id.toString()),
    onMutate: async ({ id, nickname, isFollowed }) => {
      // Update the user profile cache
      queryClient.setQueryData(
        ["user", userId],
        (oldData: IUserProfileData | undefined) =>
          updateFollowCounts(oldData, id, isFollowed),
      );

      // Update the follower/following list cache
      const queryKey = [isFollower ? "follower" : "following", userId];
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

  console.log(recommendedUserList);

  return (
    <div className="mb-8">
      {recommendedUserList.map((user, index) => (
        <UserItem
          debouncedSearchQuery={debouncedSearchQuery}
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
