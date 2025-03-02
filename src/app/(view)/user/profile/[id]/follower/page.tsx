"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import UserHeader from "@/_components/user/UserHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import { getFollower } from "@/app/api/user/getFollower";
export default function FollowerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    data: follower,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["follower", params.id],
    queryFn: ({ pageParam }) =>
      getFollower(params.id.toString(), pageParam.lastFollowId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFollowId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserProfile(params.id),
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <div className="h-full w-full max-w-[560px]">
      <UserHeader
        title={`${user?.nickname ?? "팔로잉"}`}        
        handleBackButton={() => router.replace(`/user/profile/${params.id}`)}
        bottomBorder={false}
      />

      <div className="flex flex-row">
        <div
          onClick={() => router.replace(`/user/profile/${params.id}/following`)}
          className="flex h-11 w-1/2 flex-row items-center justify-center border-b-2 border-cool-grayscale-300 cursor-pointer"
        >
          <p className="text-cool-grayscale-600">팔로잉</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {user?.followingCount ?? 0}
          </p>
        </div>
        <div
          onClick={() => router.replace(`/user/profile/${params.id}/follower`)}
          className={`flex h-11 w-1/2 flex-row items-center justify-center border-b-2 border-black cursor-pointer`}
        >
          <p className="text-base text-black">팔로워</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {user?.followerCount ?? 0}
          </p>
        </div>
      </div>
      <RecommendedUserList recommendedUserList={follower ?? []} />
    </div>
  );
}
