"use client";

import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
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
import ConfirmModal from "@/_common/ConfirmModal";
import { useDeleteFollow } from "@/_utils/hooks/useFollow";

export default function FollowPage({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(
    searchParams.get("type") === "following" ? 0 : 1,
  );
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);
  const [isDeleteFollowModalOpen, setIsDeleteFollowModalOpen] = useState(false);
  const [deleteFollowUser, setDeleteFollowUser] = useState<{
    userId: number;
    nickname: string;
  } | null>(null);

  const handleBadgeClick = useCallback(() => setIsBadgeInfoModalOpen(true), []);
  const handleCloseDeleteModal = useCallback(
    () => setIsDeleteFollowModalOpen(false),
    [],
  );
  const handleTabChange = useCallback(
    (index: number) => setActiveTabIndex(index),
    [],
  );

  const handleDeleteClick = useCallback(
    ({ userId, nickname }: { userId: number; nickname: string }) => {
      setDeleteFollowUser({ userId, nickname });
      setIsDeleteFollowModalOpen(true);
    },
    [],
  );

  const [{ data: me }, { data: user, error: userError }] = useQueries({
    queries: [
      {
        queryKey: ["my-info"],
        queryFn: getMyInfo,
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

  const { mutate: handleDeleteConfirm } = useDeleteFollow(userId);

  const isCurrentUser = useMemo(() => me?.memberId === user?.id, [me, user]);
  const title = isCurrentUser ? "내 활동" : user?.nickname || "팔로워";
  const followingCount = user?.followingCount || 0;
  const followerCount = user?.followerCount || 0;

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
              onBadgeClick={handleBadgeClick}
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
              onBadgeClick={handleBadgeClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
          <div ref={followerObserverRef} />
        </>
      </SwipeableTabView>

      {isBadgeInfoModalOpen && (
        <BadgeInfoModal
          setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen}
          showApplyButton={!me?.hasBadge}
        />
      )}
      {isDeleteFollowModalOpen && deleteFollowUser && (
        <ConfirmModal
          modalTitle={`정말 ${deleteFollowUser.nickname}님을 \n 팔로워 목록에서 삭제하시겠어요?`}
          confirmText="팔로워에서 삭제하기"
          cancelText="취소"
          handleConfirm={() => {
            handleDeleteConfirm({ id: deleteFollowUser.userId });
            handleCloseDeleteModal();
          }}
          handleCancel={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}
