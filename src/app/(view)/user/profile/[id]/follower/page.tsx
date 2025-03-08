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
import { useCallback, useMemo } from "react";

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

      <div className="flex flex-row">
        <div
          onClick={() => router.replace(`${profilePath}/following`)}
          className="flex h-11 w-1/2 cursor-pointer flex-row items-center justify-center border-b-2 border-cool-grayscale-300"
        >
          <p className="text-cool-grayscale-600">팔로잉</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {userProfile?.followingCount ?? 0}
          </p>
        </div>
        <div
          onClick={() => router.replace(`${profilePath}/follower`)}
          className="flex h-11 w-1/2 cursor-pointer flex-row items-center justify-center border-b-2 border-black"
        >
          <p className="text-base text-black">팔로워</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {userProfile?.followerCount ?? 0}
          </p>
        </div>
      </div>      
      <RecommendedUserList
        recommendedUserList={follower ?? []}
        isCurrentUser={isCurrentUser}
        userId={userId}
        isFollower={true}
      />
    </div>
  );
}
