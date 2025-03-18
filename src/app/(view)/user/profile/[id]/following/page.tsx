"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFollowee } from "@/app/api/user/follow/getFollowee";
import UserHeader from "@/_components/user/UserHeader";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import Loading from "@/_common/Loading";
import ServerToast from "@/_components/share/error/ServerToast";
import { useMemo } from "react";
import FollowTabs from "@/_components/follow/FollowTabs";

export default function FollowingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const userId = params.id;
  
  const {
    data: following,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error: followingError,
  } = useInfiniteQuery({
    queryKey: ["following", userId],
    queryFn: ({ pageParam }) =>
      getFollowee(userId.toString(), pageParam.lastFolloweeId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFolloweeId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
  });

  const isCurrentUser = useMemo(
    () => user?.id == userId,
    [user, userId],
  );

  if (isLoadingUser || isFetching) {
    return <Loading />;
  }

  if (followingError || userError) {
    console.log("followingError", followingError);
    console.log("userError", userError);
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
        title={isCurrentUser ? "내 활동" : (user?.nickname ?? "팔로잉")}
        handleBackButton={() => router.replace(`/user/profile/${userId}`)}
        bottomBorder={false}
      />

      <FollowTabs 
        userId={userId}
        followingCount={user?.followingCount ?? 0}
        followerCount={user?.followerCount ?? 0}
        activeTab="following"
      />
      
      <RecommendedUserList
        recommendedUserList={following ?? []}
        userId={userId}        
      />
    </div>
  );
}
