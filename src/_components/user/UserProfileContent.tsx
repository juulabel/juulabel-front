import LifeThumbnail from "@/_components/life/LifeThumbnail";
import NoteThumbnail from "@/_components/tasting-note/NoteThumbnail";
import LifeListSkeletonList from "@/_components/share/life/SkeletonUIForLifeList";
import SkeletomUIForList from "@/_components/share/SkeletonUIForList";
import SwipeableTabView from "@/_components/share/SwipeableTabView";
import { RefObject } from "react";
import React from "react";

interface UserProfileContentProps {
  isTastingNoteActive: boolean;
  noteList: any[];
  lifeList: any[];
  isLoadingNoteList: boolean;
  isLoadingLifeList: boolean;
  isFetchingNextNotes: boolean;
  isFetchingNextLives: boolean;
  observerRef: RefObject<HTMLDivElement>;
  isProfile?: boolean;
  onTabChange?: (isTastingNote: boolean) => void; // Optional callback to change tabs from content swipe
}

export default function UserProfileContent({
  isTastingNoteActive,
  noteList,
  lifeList,
  isLoadingNoteList,
  isLoadingLifeList,
  isFetchingNextNotes,
  isFetchingNextLives,
  observerRef,
  onTabChange,
  isProfile,
}: UserProfileContentProps) {
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
    <div className="flex h-[calc(100vh-310px)] items-center justify-center">
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
          </div>
          {isTastingNoteActive && renderLoadingIndicator(isFetchingNextNotes)}
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
          </div>
          {!isTastingNoteActive && renderLoadingIndicator(isFetchingNextLives)}
        </>
      ) : (
        renderEmptyState("일상생활")
      )}
    </>
  );

  const handleTabChange = (index: number) => {
    if (onTabChange) {
      onTabChange(index === 0);
    }
  };

  return (
    <SwipeableTabView
      activeIndex={isTastingNoteActive ? 0 : 1}
      onTabChange={handleTabChange}
      observerRef={observerRef}
    >
      {tastingNotesTab}
      {dailyLifeTab}
    </SwipeableTabView>
  );
}
