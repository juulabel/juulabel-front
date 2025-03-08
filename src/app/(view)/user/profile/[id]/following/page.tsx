"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFollowee } from "@/app/api/user/follow/getFollowee";
import UserHeader from "@/_components/user/UserHeader";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import Loading from "@/_common/Loading";
import ServerToast from "@/_components/share/error/ServerToast";
import { useCallback } from "react";
export default function FollowingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    data: following,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["following", params.id],
    queryFn: ({ pageParam }) =>
      getFollowee(params.id.toString(), pageParam.lastFolloweeId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFolloweeId: null },
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
  });

  if (isLoadingUser || isFetching) {
    return <Loading />;
  }

  if (isError || error) {
    return (
      <ServerToast
        text="데이터를 불러오는 중 에러가 발생했습니다."
        redirectPath="/"
        cookieDelete
      />
    );
  }

  return (
    <div className="h-full w-full max-w-[560px]">
      <UserHeader
        title={`${user?.id == params.id ? "내 활동" : (user?.nickname ?? "팔로잉")}`}
        handleBackButton={() => router.replace(`/user/profile/${params.id}`)}
        bottomBorder={false}
      />

      <div className="flex flex-row">
        <div
          onClick={() => router.replace(`/user/profile/${params.id}/following`)}
          className="flex h-11 w-1/2 cursor-pointer flex-row items-center justify-center border-b-2 border-black"
        >
          <p className="text-base text-black">팔로잉</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {user?.followingCount ?? 0}
          </p>
        </div>
        <div
          onClick={() => router.replace(`/user/profile/${params.id}/follower`)}
          className="flex h-11 w-1/2 cursor-pointer flex-row items-center justify-center border-b-2 border-cool-grayscale-300"
        >
          <p className="text-cool-grayscale-600">팔로워</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {user?.followerCount ?? 0}
          </p>
        </div>
      </div>
      <RecommendedUserList
        recommendedUserList={following ?? []}
        userId={params.id}
      />
    </div>
  );
}
