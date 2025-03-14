"use client";

import { IOfficialData } from "@/_types/tasting-note/officialData";
import { useInfiniteQuery } from "@tanstack/react-query";
import OfficialDataThumbnail from "./OfficialDataThumbnail";
import { getAlcoholSearchResult } from "@/app/api/search/getAlcoholSearchResult";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import Spinner from "../../search/Spinner";
import TraditionalDrinkInformationComponent from "./TraditionalDrinkInformationComponent";
import Image from "next/image";

export default function OfficialData({ searchQuery }: { searchQuery: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["alcoholSearch", searchQuery],
    queryFn: ({ pageParam }) =>
      getAlcoholSearchResult(searchQuery, pageParam.lastAlcoholicDrinksName),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.length) return null;
      return lastPage.isLast
        ? null
        : {
            lastAlcoholicDrinksName: lastPage.data.slice(-1)[0]?.name || null,
          };
    },
    initialPageParam: {
      lastAlcoholicDrinksName: null,
    },
  });

  const totalCount = data?.pages[0]?.totalCount || 0;

  const searchData = data?.pages.flatMap((page) => page.data) || [];

  const observerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <>
      {totalCount === 0 ? (
        <div className="mt-[24vh] flex flex-col items-center justify-center">
          <Image
            width={92}
            height={123}
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/note/unoffical_page_icon.png`}
            alt="비공식 데이터 사진"
          />
          <p className="my-6 text-lg font-medium text-cool-grayscale-600">
            찾으시는 검색 결과가 없어요.
          </p>
          <TraditionalDrinkInformationComponent />
        </div>
      ) : (
        <>
          <div className="mx-[4%] mt-[3%] flex flex-row items-center">
            <p className="text-base font-bold text-cool-grayscale-500">
              {totalCount}건
            </p>
            <p className="text-base font-normal text-cool-grayscale-600">
              의 검색 결과가 있어요.
            </p>
          </div>

          <div className="gay-y-5 grid grid-cols-2 gap-x-2 overflow-y-auto px-4 py-6">
            {searchData?.map((officialData: IOfficialData) => (
              <OfficialDataThumbnail key={officialData.id} {...officialData} />
            ))}
          </div>
          {isFetchingNextPage && (
            <div className="fixed bottom-9 left-1/2 z-50 -translate-x-1/2">
              <Spinner
                spinnerVisibility={true}
                className="animate-fade-in-up-loader shadow-[0_0_15px_rgba(0,0,0,0.7)]"
              />
            </div>
          )}
          <div ref={observerRef} />
        </>
      )}
    </>
  );
}
