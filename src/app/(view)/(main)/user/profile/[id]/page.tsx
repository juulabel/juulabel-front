"use client";

import FollowButton from "@/_common/FollowButton";
import UserHeader from "@/_components/user/UserHeader";
import UserProfileHeader from "@/_components/user/UserProfileHeader";
import UserProfileStats from "@/_components/user/UserProfileStats";
import UserProfileContent from "@/_components/user/UserProfileContent";
import SkeletonUIForUserProfile from "@/_components/share/SkeletonUIForUserProfile";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import SwipeableTabBar from "@/_components/share/SwipeableTabBar";
import { useProfileFollow } from "@/_utils/hooks/useFollow";
import getMyInfo from "@/app/api/auth/getMyInfo";
import ServerToast from "@/_components/share/error/ServerToast";

export default function Page({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

  const { mutate } = useProfileFollow(userId, user?.isFollowed, user?.nickname);

  // Handle tab change
  const handleTabChange = useCallback((index: number) => {
    setActiveTabIndex(index);
  }, []);

  // Content queries with shared config

  if (isLoadingMe || isLoadingUser) return <SkeletonUIForUserProfile />;
  if (meError || userError)
    return (
      <ServerToast
        text={"데이터를 불러오는 중 에러가 발생했습니다."}
        redirectPath={"/"}
        cookieDelete
      />
    );
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  const totalPosts = (user.tastingNoteCount || 0) + (user.dailyLifeCount || 0);
  const isCurrentUser = me?.memberId === user.id;
  const contentTopPadding = isCurrentUser ? "pt-[300px]" : "pt-[350px]";

  return (
    <div className="relative h-full w-full max-w-[560px]">
      <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
        <UserHeader
          title="유저 프로필"
          handleBackButton={() => router.back()}
          bottomBorder={true}
        />

        <UserProfileHeader
          profileImage={user.profileImage}
          nickname={user.nickname}
          introduction={user.introduction}
          hasBadge={user.hasBadge}
          onBadgeClick={() => setIsBadgeInfoModalOpen(true)}
        />

        {!isCurrentUser && (
          <div className="flex justify-center">
            <FollowButton
              textSize="sm"
              isFollowed={user.isFollowed}
              onChangeFollow={() => mutate()}
            />
          </div>
        )}

        <UserProfileStats
          memberId={userId}
          followingCount={user.followingCount ?? 0}
          followerCount={user.followerCount ?? 0}
          totalPosts={totalPosts}
        />

        <SwipeableTabBar
          activeTabIndex={activeTabIndex}
          onTabChange={handleTabChange}
        >
          <div className="flex flex-row items-center">
            <p>시음노트</p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {user.tastingNoteCount}개
            </p>
          </div>

          <div className="flex flex-row items-center">
            <p>일상생활</p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {user.dailyLifeCount}개
            </p>
          </div>
        </SwipeableTabBar>
      </div>
      <div className={`px-4 ${contentTopPadding}`}>
        <UserProfileContent
          activeTabIndex={activeTabIndex}
          onTabChange={handleTabChange}
          userId={userId}
          isProfile={true}
        />
      </div>
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal
          showApplyButton={!me?.hasBadge}
          setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen}
        />
      )}
    </div>
  );
}
