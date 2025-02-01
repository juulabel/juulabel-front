"use client";

import NoteThumbnail from "@/_common/NoteThumbnail";
import Spinner from "@/_components/search/Spinner";
import ShareLayout from "@/_components/share/ShareLayout";
import SkeletomUIForList from "@/_components/share/SkeletonUIForList";
import { INoteThumbnail } from "@/_types/share";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import getNoteList from "@/app/api/tasting-note/getNoteList";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Notes() {
  const {
    data: notes,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getNoteList"],
    queryFn: ({ pageParam }) =>
      getNoteList({
        lastTastingNoteId: pageParam.lastTastingNoteId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.length) return null;

      return lastPage.last
        ? null
        : {
            lastTastingNoteId: lastPage.data.slice(-1)[0].TastingNoteId || null,
          };
    },
    initialPageParam: {
      lastTastingNoteId: null,
    },
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
    gcTime: 0,
    staleTime: 0,
  });

  const observerRef = useInfiniteScroll({
    hasNextPage: hasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    fetchNextPage: fetchNextPage,
  });

  // 임시 에러 및 로딩 컴포넌트
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>An error occurred : {error.message}</div>;

  if (isFetching && !isFetchingNextPage) return <SkeletomUIForList />;

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-y-auto px-4 py-6">
      {notes?.map((note) => (
        <NoteThumbnail key={note.TastingNoteId} {...note} />
      ))}
      {isFetchingNextPage && (
        <div className="fixed bottom-9 left-1/2 z-50 -translate-x-1/2">
          <Spinner spinnerVisibility className="animate-fade-in-up-loader" />
        </div>
      )}
      <div ref={observerRef}></div>
    </div>
  );
}
