"use client";

import LifeList from "@/_components/life/LifeList";
import Navigation from "@/_common/Navigation";
import NoteThumbnail from "@/_components/tasting-note/NoteThumbnail";
// import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import ServerToast from "@/_components/share/error/ServerToast";
import LifeListSkeletonList from "@/_components/share/life/SkeletonUIForLifeList";
import SkeletomUIForList from "@/_components/share/SkeletonUIForList";
import SkeletonUIForUserProfile from "@/_components/share/SkeletonUIForUserProfile";
import MySpaceHeader from "@/_components/user/MySpaceHeader";
import { IMySpace } from "@/_types/user/mySpaceData";
import { cn } from "@/_utils/commons";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { getMyLife } from "@/app/api/user/getMyLife";
import { getMyNote } from "@/app/api/user/getMyNote";
import { getMySpace } from "@/app/api/user/getMySpace";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const [isTastingNoteClicked, setIsTastingNoteClicked] = useState(true);
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);

  const imagePath = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH;
  const defaultProfileImage = useMemo(
    () => `${imagePath}/images/placeholders/profile/default_profile.png`,
    [imagePath],
  );

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

  const handleTabClick = useCallback((type: "noteList" | "lives") => {
    setIsTastingNoteClicked(type === "noteList");
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
  const isActiveTab = isTastingNoteClicked
    ? "border-black text-base text-black"
    : "border-cool-grayscale-300 text-cool-grayscale-600";
  const isInactiveTab = !isTastingNoteClicked
    ? "border-black text-base text-black"
    : "border-cool-grayscale-300 text-cool-grayscale-600";

  const renderLoadingIndicator = (isFetching: boolean, hasMore: boolean) => {
    if (isFetching) return null;
    if (hasMore) {
      return (
        <div className="flex h-12 w-full items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cool-grayscale-200 border-t-blue-500"></div>
        </div>
      );
    }
    return <br />;
  };

  const renderEmptyState = (type: string) => (
    <div className="flex h-[calc(100vh-310px)] items-center justify-center">
      <p className="text-base font-medium text-slate-500">
        작성된 {type}이 없어요
      </p>
    </div>
  );

  return (
    <>
      <div className="relative h-full w-full max-w-[560px]">
        <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
          <MySpaceHeader title="내 공간" />

          <div className="mx-[4%] flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <div className="inline-flex h-[72px] w-[72px]">
                <Image
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full"
                  src={user.profileImage ?? defaultProfileImage}
                  alt="유저 이미지"
                />
              </div>
              {user.hasBadge && (
                <Image
                  onClick={() => setIsBadgeInfoModalOpen(true)}
                  src={`${imagePath}/images/kisa-badge.png`}
                  alt="배지"
                  className="ml-2"
                  width={32}
                  height={32}
                />
              )}
              <p className="ml-2 text-lg font-bold leading-7">
                {user.nickname}
              </p>
            </div>
            <Link href="/user/my-info">
              <Image
                width={24}
                height={24}
                className="rounded-full"
                src={`${imagePath}/svg/right-arrow.svg`}
                alt="내정보"
              />
            </Link>
          </div>
          <div
            className={cn(
              "my-4 flex text-sm font-medium",
              user.introduction
                ? "mx-[4%] text-slate-700"
                : "items-center justify-center text-cool-grayscale-500",
            )}
          >
            {user.introduction ? (
              <p>{user.introduction}</p>
            ) : (
              <p>작성된 자기소개가 없어요</p>
            )}
          </div>
          {/* <div className="mx-[12%] mt-6 flex flex-row items-center justify-between">
            <Link
              href={`/user/profile/${user.memberId}/following`}
              className="flex flex-col items-center justify-center"
            >
              <p className="text-sm font-normal text-cool-grayscale-500">
                팔로잉
              </p>
              <p className="text-base font-bold text-cool-grayscale-800">
                {user.followingCount ?? 0}
              </p>
            </Link>

            <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

            <Link
              href={`/user/profile/${user.memberId}/follower`}
              className="flex flex-col items-center justify-center"
            >
              <p className="text-sm font-normal text-cool-grayscale-500">
                팔로워
              </p>
              <p className="text-base font-bold text-cool-grayscale-800">
                {user.followerCount ?? 0}
              </p>
            </Link>

            <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-normal text-cool-grayscale-500">
                총 게시글
              </p>
              <p className="text-base font-bold text-cool-grayscale-800">
                {totalPosts}
              </p>
            </div>
          </div> */}

          <div className="flex flex-row pt-4">
            <button
              className={`flex h-11 w-1/2 flex-row items-center justify-center border-b-2 ${isActiveTab}`}
              onClick={() => handleTabClick("noteList")}
            >
              <p>시음노트</p>
              <p className="ml-1 text-sm text-cool-grayscale-600">
                {user.myTastingNoteCount}개
              </p>
            </button>
            <button
              className={`flex h-11 w-1/2 flex-row items-center justify-center border-b-2 ${isInactiveTab}`}
              onClick={() => handleTabClick("lives")}
            >
              <p>일상생활</p>
              <p className="ml-1 text-sm text-cool-grayscale-600">
                {user.myDailyLifeCount}개
              </p>
            </button>
          </div>
        </div>
        <div className="h-full overflow-y-auto px-4 pt-[250px] scrollbar-hide">
          {isTastingNoteClicked ? (
            isLoadingNoteList ? (
              <SkeletomUIForList />
            ) : noteList && noteList.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 py-6 pb-[70px]">
                  {noteList.map((note) => (
                    <NoteThumbnail key={note.TastingNoteId} {...note} />
                  ))}
                </div>
                <div ref={observerRef} className="loading-indicator">
                  {renderLoadingIndicator(isFetchingNextPageNote, hasNextPage)}
                </div>
              </>
            ) : (
              renderEmptyState("시음노트")
            )
          ) : isLoadingLifeList ? (
            <LifeListSkeletonList />
          ) : lifeList && lifeList.length > 0 ? (
            <div className="pb-10 pt-3">
              {lifeList.map((post) => (
                <LifeList key={post.dailyLifeId} {...post} />
              ))}
              <div ref={observerRef} className="loading-indicator">
                {renderLoadingIndicator(
                  isFetchingNextLifePage,
                  hasNextLifePage,
                )}
              </div>
            </div>
          ) : (
            renderEmptyState("일상생활")
          )}
        </div>
      </div>
      <Navigation />
      {/* {isBadgeInfoModalOpen && (
        <BadgeInfoModal setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen} />
      )} */}
    </>
  );
}
