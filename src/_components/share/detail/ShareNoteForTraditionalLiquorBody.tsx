"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import getTastingNoteForAlcoholicDrinks from "@/app/api/tasting-note/getTastingNoteForAlcoholicDrinks";
import React, { useEffect } from "react";
import ShareNoteThumbnailForGather from "@/_components/share/detail/ShareNoteThumbnailForGather";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Spinner from "@/_components/search/Spinner";
import useTastingNoteStore from "@/_store/tastingNoteCountState";
import ServerToast from "@/_components/share/error/ServerToast";
import Image from "next/image";
import ScrollUpFloatingBtn from "@/_components/search/ScrollUpFloatingBtn"; // 기본 스타일 추가

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
    isError,
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
  const { setTastingNoteTotalCount } = useTastingNoteStore();

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract total count from the first page and first item
      const totalCount = data[0].tastingNoteTotalCount ?? 0;

      setTastingNoteTotalCount(totalCount);
    } else {
      // Default to 0 if no data exists
      setTastingNoteTotalCount(0);
    }
  }, [data, setTastingNoteTotalCount, isError]);

  if (status === "pending" && !isFetchingNextPage) {
    return <SkeletonUI />;
  }

  if (isError) {
    return (
      <ServerToast text={"잘못된 접근입니다."} redirectPath={"/share/note"} />
    );
  }

  return (
    <>
      <div className={"grid grid-cols-2 gap-x-2 gap-y-5"}>
        {data?.length === 0 && (
          <div className="col-span-2 mt-[24vh] flex w-full flex-col items-center justify-center justify-self-center">
            <Image
              width={92}
              height={123}
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/note/unoffical_page_icon.png`}
              alt="비공식 데이터 사진"
            />
            <p className="my-6 text-lg font-medium text-cool-grayscale-600">
              찾으시는 결과가 없어요.
            </p>
          </div>
        )}
        {data?.map((note) => {
          return (
            <ShareNoteThumbnailForGather key={note.TastingNoteId} {...note} />
          );
        })}
        <div ref={observerRef}></div>
      </div>
      <ScrollUpFloatingBtn layoutId={"layout-liquor"} />
      {isFetchingNextPage && (
        <div className="fixed bottom-1 left-1/2 z-50 -translate-x-1/2 transform">
          <Spinner spinnerVisibility={true} />
        </div>
      )}
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
