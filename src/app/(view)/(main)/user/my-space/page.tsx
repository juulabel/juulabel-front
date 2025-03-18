"use client";

import Navigation from "@/_common/Navigation";
import ServerToast from "@/_components/share/error/ServerToast";
import SkeletonUIForUserProfile from "@/_components/share/SkeletonUIForUserProfile";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import MySpaceHeader from "@/_components/user/MySpaceHeader";
import UserProfileHeader from "@/_components/user/UserProfileHeader";
import UserProfileStats from "@/_components/user/UserProfileStats";
import UserProfileContent from "@/_components/user/UserProfileContent";
import SwipeableTabBar from "@/_components/share/SwipeableTabBar";
import { IMySpace } from "@/_types/user/mySpaceData";
import { getMySpace } from "@/app/api/user/getMySpace";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);

  const imagePath = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH;

  // User data query
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<IMySpace>({
    queryKey: ["my-space"],
    queryFn: () => getMySpace(cookies.accessToken),
  });

  const handleTabChange = useCallback((index: number) => {
    setActiveTabIndex(index);
  }, []);

  if (isLoadingUser) return <SkeletonUIForUserProfile />;
  if (userError)
    return <ServerToast text="에러가 발생했습니다" redirectPath="/" />;
  if (!user) return null;

  const totalPosts = user.myTastingNoteCount + user.myDailyLifeCount;

  return (
    <>
      <div className="relative h-full w-full max-w-[560px]">
        <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
          <MySpaceHeader title="내 공간" />

          <UserProfileHeader
            profileImage={user.profileImage}
            nickname={user.nickname}
            introduction={user.introduction}
            hasBadge={user.hasBadge}
            onBadgeClick={() => setIsBadgeInfoModalOpen(true)}
            rightElement={
              <Link href="/user/my-info">
                <Image
                  width={24}
                  height={24}
                  className="rounded-full"
                  src={`${imagePath}/svg/right-arrow.svg`}
                  alt="내정보"
                />
              </Link>
            }
          />

          <UserProfileStats
            memberId={user.memberId.toString()}
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
                {user.myTastingNoteCount}개
              </p>
            </div>
            <div className="flex flex-row items-center">
              <p>일상생활</p>
              <p className="ml-1 text-sm text-cool-grayscale-600">
                {user.myDailyLifeCount}개
              </p>
            </div>
          </SwipeableTabBar>
        </div>

        <div className="px-4 pt-[300px]">
          <UserProfileContent
            activeTabIndex={activeTabIndex}
            userId={user.memberId.toString()}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
      <Navigation />
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal
          showApplyButton={false}
          setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen}
        />
      )}
    </>
  );
}
