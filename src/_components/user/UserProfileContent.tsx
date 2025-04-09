import LifeThumbnail from "@/_components/life/LifeThumbnail";
import NoteThumbnail from "@/_components/tasting-note/NoteThumbnail";
import LifeListSkeletonList from "@/_components/share/life/SkeletonUIForLifeList";
import SkeletomUIForList from "@/_components/share/SkeletonUIForList";
import SwipeableTabView from "@/_components/share/SwipeableTabView";
import { useCallback, useMemo } from "react";
import React from "react";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserContent } from "@/app/api/user/fetchUserContent";
import { useCookies } from "react-cookie";

interface UserProfileContentProps {
  activeTabIndex: number;
  userId: string;

  isProfile?: boolean;
  onTabChange?: (index: number) => void; // Optional callback to change tabs from content swipe
}

export default function UserProfileContent({
  activeTabIndex,
  userId,
  onTabChange,
  isProfile,
}: UserProfileContentProps) {
  const [cookies] = useCookies(["accessToken"]);

  // Tasting notes query
  const {
    data: noteData,
    fetchNextPage: fetchNextNotePage,
    hasNextPage: hasNextNotePage,
    isFetchingNextPage: isFetchingNextNotePage,
    isLoading: isLoadingNoteList,
  } = useInfiniteQuery({
    queryKey: [`${userId}-notes`],
    queryFn: ({ pageParam }) =>
      fetchUserContent({
        pageParam,
        contentType: "notes",
        userId: userId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      const lastItem = lastPage.content.slice(-1)[0];
      return { lastTastingNoteId: lastItem.TastingNoteId };
    },
    initialPageParam: { lastTastingNoteId: null },
    enabled: !!cookies.accessToken && activeTabIndex === 0,
  });

  // Daily lives query
  const {
    data: lifeData,
    isLoading: isLoadingLifeList,
    fetchNextPage: fetchNextLifePage,
    hasNextPage: hasNextLifePage,
    isFetchingNextPage: isFetchingNextLifePage,
  } = useInfiniteQuery({
    queryKey: [`${userId}-lives`],
    queryFn: ({ pageParam }) =>
      fetchUserContent({
        pageParam,
        contentType: "lives",
        userId: userId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      const lastItem = lastPage.content.slice(-1)[0];
      return { lastDailyLifeId: lastItem.dailyLifeId };
    },
    initialPageParam: { lastDailyLifeId: null },
    enabled: !!cookies.accessToken && activeTabIndex === 1,
  });

  // Memoized content lists
  const noteList = useMemo(
    () => noteData?.pages.flatMap((page) => page.content || []) || [],
    [noteData],
  );

  const lifeList = useMemo(
    () => lifeData?.pages.flatMap((page) => page.content || []) || [],
    [lifeData],
  );

  // Pagination state based on active tab
  const notesPaginationState = {
    hasNextPage: hasNextNotePage,
    isFetchingNextPage: isFetchingNextNotePage,
    fetchNextPage: fetchNextNotePage,
  };

  const livesPaginationState = {
    hasNextPage: hasNextLifePage,
    isFetchingNextPage: isFetchingNextLifePage,
    fetchNextPage: fetchNextLifePage,
  };

  const notesObserverRef = useInfiniteScroll(notesPaginationState);
  const livesObserverRef = useInfiniteScroll(livesPaginationState);

  const renderLoadingIndicator = (isFetching: boolean) => {
    if (isFetching) {
      return (
        <div className="flex h-12 w-full items-center justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cool-grayscale-200 border-t-blue-500"></div>
        </div>
      );
    }
    return null;
  };

  const renderEmptyState = (type: string) => (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center">
      <p className="text-base font-medium text-slate-500">
        작성된 {type}이 없어요
      </p>
    </div>
  );

  // Content for the tasting notes tab
  const tastingNotesTab = (
    <>
      {isLoadingNoteList ? (
        <SkeletomUIForList />
      ) : noteList?.length ? (
        <>
          <div
            className={`grid grid-cols-2 gap-x-5 gap-y-5 py-6 ${isProfile ? "pb-1" : "pb-20"}`}
          >
            {noteList.map((note) => (
              <NoteThumbnail key={note.TastingNoteId} {...note} />
            ))}
            <div ref={notesObserverRef} />
          </div>
          {activeTabIndex === 0 &&
            renderLoadingIndicator(isFetchingNextNotePage)}
        </>
      ) : (
        renderEmptyState("시음노트")
      )}
    </>
  );

  // Content for the daily life tab
  const dailyLifeTab = (
    <>
      {isLoadingLifeList ? (
        <LifeListSkeletonList />
      ) : lifeList?.length ? (
        <>
          <div className={`${isProfile ? "pb-0 pt-3" : "pb-20 pt-3"}`}>
            {lifeList.map((post) => (
              <LifeThumbnail key={post.dailyLifeId} {...post} />
            ))}
            <div ref={livesObserverRef} />
          </div>
          {activeTabIndex === 1 &&
            renderLoadingIndicator(isFetchingNextLifePage)}
        </>
      ) : (
        renderEmptyState("일상생활")
      )}
    </>
  );

  return (
    <SwipeableTabView activeIndex={activeTabIndex} onTabChange={onTabChange}>
      {tastingNotesTab}
      {dailyLifeTab}
    </SwipeableTabView>
  );
}
