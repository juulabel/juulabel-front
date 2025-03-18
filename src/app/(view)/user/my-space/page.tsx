"use client";

import Navigation from "@/_common/Navigation";
import ServerToast from "@/_components/share/error/ServerToast";
import SkeletonUIForUserProfile from "@/_components/share/SkeletonUIForUserProfile";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import MySpaceHeader from "@/_components/user/MySpaceHeader";
import UserProfileHeader from "@/_components/user/UserProfileHeader";
import UserProfileStats from "@/_components/user/UserProfileStats";
import UserProfileTabs from "@/_components/user/UserProfileTabs";
import UserProfileContent from "@/_components/user/UserProfileContent";
import { IMySpace } from "@/_types/user/mySpaceData";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { getMyLife } from "@/app/api/user/getMyLife";
import { getMyNote } from "@/app/api/user/getMyNote";
import { getMySpace } from "@/app/api/user/getMySpace";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useCookies } from "react-cookie";
import React from "react";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const [isTastingNoteClicked, setIsTastingNoteClicked] = useState(true);
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);

  const imagePath = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH;

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<IMySpace>({
    queryKey: ["my-space"],
    queryFn: () => getMySpace(cookies.accessToken),
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: noteList,
    isLoading: isLoadingNoteList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isFetchingNextPageNote,
    isError: isNotesError,
  } = useInfiniteQuery({
    queryKey: ["my-note"],
    queryFn: ({ pageParam }) =>
      getMyNote({
        accessToken: cookies.accessToken,
        lastNoteId: pageParam.lastNoteId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      return { lastNoteId: lastPage.content.slice(-1)[0].TastingNoteId };
    },
    initialPageParam: { lastNoteId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
    enabled: !!cookies.accessToken && isTastingNoteClicked,
  });

  const {
    data: lifeList,
    isLoading: isLoadingLifeList,
    fetchNextPage: fetchNextLifePage,
    hasNextPage: hasNextLifePage,
    isFetchingNextPage: isFetchingNextLifePage,
    isError: isLifeError,
  } = useInfiniteQuery({
    queryKey: ["my-life"],
    queryFn: ({ pageParam }) =>
      getMyLife({
        accessToken: cookies.accessToken,
        lastLifeId: pageParam.lastLifeId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      return { lastLifeId: lastPage.content.slice(-1)[0].dailyLifeId };
    },
    initialPageParam: { lastLifeId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
    enabled: !!cookies.accessToken && !isTastingNoteClicked,
  });

  const handleTabClick = useCallback((isTastingNote: boolean) => {
    setIsTastingNoteClicked(isTastingNote);
  }, []);

  const observerRef = useInfiniteScroll({
    hasNextPage: isTastingNoteClicked ? hasNextPage : hasNextLifePage,
    isFetchingNextPage: isTastingNoteClicked
      ? isFetchingNextPageNote
      : isFetchingNextLifePage,
    fetchNextPage: isTastingNoteClicked ? fetchNextPage : fetchNextLifePage,
  });

  if (isLoadingUser) return <SkeletonUIForUserProfile />;
  if (userError || isNotesError || isLifeError)
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

          <UserProfileTabs
            isTastingNoteActive={isTastingNoteClicked}
            tastingNoteCount={user.myTastingNoteCount}
            dailyLifeCount={user.myDailyLifeCount}
            onTabChange={handleTabClick}
          />
        </div>

        <div className="px-4 pt-[300px]">
          <UserProfileContent
            isTastingNoteActive={isTastingNoteClicked}
            noteList={noteList || []}
            lifeList={lifeList || []}
            isLoadingNoteList={isLoadingNoteList}
            isLoadingLifeList={isLoadingLifeList}
            isFetchingNextNotes={isFetchingNextPageNote}
            isFetchingNextLives={isFetchingNextLifePage}
            onTabChange={handleTabClick}
            observerRef={observerRef}
          />
        </div>
      </div>
      <Navigation />
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen} />
      )}
    </>
  );
}
