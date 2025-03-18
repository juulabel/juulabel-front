"use client";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import UserHeader from "@/_components/user/UserHeader";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import { getFollower } from "@/app/api/user/follow/getFollower";
import Loading from "@/_common/Loading";
import ServerToast from "@/_components/share/error/ServerToast";
import { useMemo } from "react";
import FollowTabs from "@/_components/follow/FollowTabs";

export default function FollowerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const userId = params.id;

  const {
    data: follower,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["follower", userId],
    queryFn: ({ pageParam }) => getFollower(userId, pageParam.lastFollowId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFollowId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: userProfile,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
  });

  const isCurrentUser = useMemo(
    () => userProfile?.id == userId,
    [userProfile, userId],
  );
  const profilePath = useMemo(() => `/user/profile/${userId}`, [userId]);

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
        title={isCurrentUser ? "내 활동" : (userProfile?.nickname ?? "팔로워")}
        handleBackButton={() => router.replace(profilePath)}
        bottomBorder={false}
      />

      <FollowTabs
        userId={userId}
        followingCount={userProfile?.followingCount ?? 0}
        followerCount={userProfile?.followerCount ?? 0}
        activeTab="follower"
      />

      <RecommendedUserList
        recommendedUserList={follower ?? []}
        isCurrentUser={isCurrentUser}
        userId={userId}
        isFollower={true}
      />
    </div>
  );
}
