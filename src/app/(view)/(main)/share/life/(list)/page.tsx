"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getLifeList } from "@/app/api/life/getLifeList";
import LifeThumbnail from "@/_components/life/LifeThumbnail";
import Spinner from "@/_components/search/Spinner";
import ServerToast from "@/_components/share/error/ServerToast";
import LifeListSkeletonList from "@/_components/share/life/SkeletonUIForLifeList";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";

export default function Lifes() {
  const {
    data: life,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["life"],
    queryFn: ({ pageParam }) =>
      getLifeList({ lastDailyLifeId: pageParam.lastDailyLifeId }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastDailyLifeId: null },
    select: (data) => data.pages.flatMap((page) => page.content),
    gcTime: 0,
    staleTime: 0,
  });

  const observerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isFetching && !isFetchingNextPage) {
    return <LifeListSkeletonList />;
  }

  if (isError) {
    return <ServerToast text="에러가 발생했습니다" redirectPath="/" />;
  }

  return (
    <div className="pb-[65px]">
      <ul>
        {life?.map((post) => (
          <li key={post.dailyLifeId}>
            <LifeThumbnail {...post} />
          </li>
        ))}
        <div ref={observerRef} />
      </ul>
      {isFetchingNextPage && (
        <div className="fixed bottom-9 left-1/2 z-50 -translate-x-1/2">
          <Spinner spinnerVisibility={true} />
        </div>
      )}
    </div>
  );
}
