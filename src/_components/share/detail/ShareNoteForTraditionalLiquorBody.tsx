"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import getTastingNoteForAlcoholicDrinks from "@/app/api/tasting-note/getTastingNoteForAlcoholicDrinks";
import React, { useEffect } from "react";
import ShareNoteThumbnailForGather from "@/_components/share/detail/ShareNoteThumbnailForGather";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Spinner from "@/_components/search/Spinner"; // 기본 스타일 추가

interface Props {
  id: number;
}

export default function ShareNoteForTraditionalLiquorBody({ id }: Props) {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ["shareNoteForTraditionalLiquor", id],
    queryFn: ({ pageParam }) =>
      getTastingNoteForAlcoholicDrinks({
        alcoholicDrinksId: pageParam.alcoholicDrinksId,
        lastTastingNoteId: pageParam.lastTastingNoteId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.length) return null;
      return lastPage.last
        ? null
        : {
            lastTastingNoteId: lastPage.data.slice(-1)[0].TastingNoteId || null,
            alcoholicDrinksId: id,
          };
    },
    initialPageParam: {
      alcoholicDrinksId: id,
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

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (status === "pending" && !isFetchingNextPage) {
    return <SkeletonUI />;
  }

  return (
    <>
      <div className={"grid grid-cols-2 gap-x-2 gap-y-5"}>
        {data?.map((note) => {
          return (
            <ShareNoteThumbnailForGather key={note.TastingNoteId} {...note} />
          );
        })}
        <div ref={observerRef}></div>
      </div>
      {isFetchingNextPage && <Spinner spinnerVisibility={true} />}
    </>
  );
}

function SkeletonUI() {
  useEffect(() => {
    document.querySelector("#layout-liquor");
    const element = document.getElementById("layout-liquor");

    if (element) {
      const originalOverflow = element.style.overflow;
      element.style.overflow = "hidden";

      return () => {
        element.style.overflow = originalOverflow;
      };
    }
  }, []);
  return (
    <div className="grid w-full grid-cols-2 gap-x-4">
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
    </div>
  );
}
