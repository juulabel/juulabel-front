"use client";

import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { getFollowee } from "@/app/api/user/follow/getFollowee";
import UserHeader from "@/_components/user/UserHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import ServerToast from "@/_components/share/error/ServerToast";
import { useCallback, useMemo, useState } from "react";
import SwipeableTabBar from "@/_components/share/SwipeableTabBar";
import SwipeableTabView from "@/_components/share/SwipeableTabView";
import { getFollower } from "@/app/api/user/follow/getFollower";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import getMyInfo from "@/app/api/auth/getMyInfo";
import UserListSkeleton from "@/_components/follow/UserListSkeleton";

export default function FollowPage({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(
    type === "following" ? 0 : 1,
  );
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);

  const [
    { data: me, isLoading: isLoadingMe, error: meError },
    { data: user, isLoading: isLoadingUser, error: userError },
  ] = useQueries({
    queries: [
      {
        queryKey: ["my-info"],
        queryFn: () => getMyInfo(),
      },
      {
        queryKey: ["user", userId],
        queryFn: () => getUserProfile(userId),
      },
    ],
  });

  // Following query
  const followingQuery = useInfiniteQuery({
    queryKey: ["following", userId],
    queryFn: ({ pageParam }) => getFollowee(userId, pageParam?.lastFolloweeId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFolloweeId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
  });

  // Follower query
  const followerQuery = useInfiniteQuery({
    queryKey: ["follower", userId],
    queryFn: ({ pageParam }) => getFollower(userId, pageParam?.lastFollowId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFollowId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
  });

  const followingObserverRef = useInfiniteScroll({
    hasNextPage: followingQuery.hasNextPage,
    isFetchingNextPage: followingQuery.isFetchingNextPage,
    fetchNextPage: followingQuery.fetchNextPage,
  });

  const followerObserverRef = useInfiniteScroll({
    hasNextPage: followerQuery.hasNextPage,
    isFetchingNextPage: followerQuery.isFetchingNextPage,
    fetchNextPage: followerQuery.fetchNextPage,
  });

  const isCurrentUser = useMemo(() => me?.memberId === user?.id, [me, user]);

  const handleTabChange = useCallback((index: number) => {
    setActiveTabIndex(index);
  }, []);

  const hasError = followingQuery.error || userError || followerQuery.error;

  if (hasError) {
    return (
      <ServerToast
        text="데이터를 불러오는 중 에러가 발생했습니다."
        redirectPath="/"
        cookieDelete
      />
    );
  }

  const title = isCurrentUser ? "내 활동" : user?.nickname || "팔로워";
  const followingCount = user?.followingCount || 0;
  const followerCount = user?.followerCount || 0;

  return (
    <div className="h-full w-full max-w-[560px]">
      <UserHeader
        title={title}
        handleBackButton={() => router.back()}
        bottomBorder={false}
        isMarginBottom={false}
      />

      <SwipeableTabBar
        activeTabIndex={activeTabIndex}
        onTabChange={handleTabChange}
      >
        {["팔로잉", "팔로워"].map((label, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-center"
          >
            <p
              className={
                activeTabIndex === index
                  ? "text-base text-black"
                  : "text-cool-grayscale-600"
              }
            >
              {label}
            </p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {index === 0 ? followingCount : followerCount}
            </p>
          </div>
        ))}
      </SwipeableTabBar>

      <SwipeableTabView
        activeIndex={activeTabIndex}
        onTabChange={handleTabChange}
      >
        <>
          {followingQuery.isLoading ? (
            <UserListSkeleton count={10} />
          ) : (
            <RecommendedUserList
              recommendedUserList={followingQuery.data ?? []}
              userId={userId}
              onBadgeClick={() => setIsBadgeInfoModalOpen(true)}
            />
          )}
          <div ref={followingObserverRef} />
        </>
        <>
          {followerQuery.isLoading ? (
            <UserListSkeleton count={10} />
          ) : (
            <RecommendedUserList
              recommendedUserList={followerQuery.data ?? []}
              userId={userId}
              showDeleteButton
              onBadgeClick={() => setIsBadgeInfoModalOpen(true)}
            />
          )}
          <div ref={followerObserverRef} />
        </>
      </SwipeableTabView>

      {isBadgeInfoModalOpen && (
        <BadgeInfoModal
          setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen}
          showApplyButton={false}
        />
      )}
    </div>
  );
}
