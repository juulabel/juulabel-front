"use client";

import { IAlcoholTypeTab } from "@/_types/search/alcoholTypeTab";
import { IAlcoholTypeData } from "@/_types/search/alcoholTypeData";
import { cn } from "@/_utils/commons";
import Image from "next/image";
import { useMemo, useState, useCallback } from "react";
import { GoChevronLeft } from "react-icons/go";
import { IAlcoholSortedType } from "@/_types/search/alcoholSortedType";
import AlcoholTypeLoader from "./AlcoholTypeLoader";
import AlcoholTypeDataThumbnail from "./AlcoholTypeDataThumbnail";
import Spinner from "./Spinner";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAlcoholTypeResult } from "@/app/api/search/getAlcoholTypeResult";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";

const TAB_ITEMS: IAlcoholTypeTab[] = [
  { id: 1, value: "탁주" },
  { id: 2, value: "소주•증류주" },
  { id: 3, value: "약청주" },
  { id: 4, value: "과실주" },
  { id: 5, value: "기타 주류" },
];

const SORTED_TYPE_ITEMS: IAlcoholSortedType[] = [
  { id: "NAME", value: "가나다 순" },
  { id: "TASTING_NOTE_COUNT_HIGH", value: "달점 높은 순" },
  { id: "RATING_HIGH", value: "리뷰 많은 순" },
  { id: "PRICE_HIGH", value: "높은 가격 순" },
  { id: "PRICE_LOW", value: "낮은 가격 순" },
];

export default function AlcoholTypeData({
  handleCloseSearchList,
  selectedTab,
  setSelectedTab,
}: {
  handleCloseSearchList: () => void;
  selectedTab: IAlcoholTypeTab;
  setSelectedTab: (tab: IAlcoholTypeTab) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSortedType, setSelectedSortedType] =
    useState<IAlcoholSortedType>({
      id: "NAME",
      value: "가나다 순",
    });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["alcoholTypeData", selectedTab.id, selectedSortedType.id],
      queryFn: ({ pageParam }) =>
        getAlcoholTypeResult(
          selectedTab.id,
          selectedSortedType.id,
          pageParam.lastAlcoholicDrinksName,
        ),
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

  const alcoholTypeData = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages],
  );

  const totalCount = data?.pages[0]?.totalCount || 0;

  const observerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const toggleFilter = useCallback(() => setIsFilterOpen((prev) => !prev), []);

  const handleSortTypeSelect = useCallback((sortedType: IAlcoholSortedType) => {
    setSelectedSortedType(sortedType);
    setIsFilterOpen(false);
  }, []);

  return (
    <div className="w-full max-w-[560px]">
      <div className="sticky top-0 z-50 flex h-16 flex-row items-center justify-between bg-white px-2">
        <button onClick={handleCloseSearchList}>
          <GoChevronLeft size={24} />
        </button>
        <div className="text-lg font-bold">전통주 리스트</div>
        <div aria-hidden="true" />
      </div>

      <div className="flex items-start justify-start gap-4 border-y border-slate-200 px-4">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex items-center justify-center py-[0.54rem] font-medium text-cool-grayscale-500",
              selectedTab.id === tab.id && "border-b-2 border-black text-black",
            )}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.value}
          </button>
        ))}
      </div>

      <div className="relative mx-[4%] mt-[3%] flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <p className="px-1 text-base font-bold text-cool-grayscale-500">총</p>
          <p className="text-base font-bold text-[#ff823b]">{totalCount}개</p>
          <p className="text-base font-normal text-cool-grayscale-600">
            의 리스트가 있어요.
          </p>
        </div>

        <button
          onClick={toggleFilter}
          className="relative z-10 inline-flex h-6 items-center justify-start gap-0.5"
          aria-expanded={isFilterOpen}
          aria-haspopup="true"
        >
          <div className="text-center text-base font-medium leading-normal text-slate-500">
            {selectedSortedType.value}
          </div>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}${isFilterOpen ? "/svg/up_arrow.svg" : "/svg/under.svg"}`}
            alt="정렬 아이콘"
            width={16}
            height={16}
          />
        </button>

        {isFilterOpen && (
          <div className="absolute right-0 top-8 z-20 w-[120px] rounded-lg bg-white p-3 shadow-lg">
            {SORTED_TYPE_ITEMS.map((sortedType) => (
              <button
                key={sortedType.id}
                onClick={() => handleSortTypeSelect(sortedType)}
                className="inline-flex w-full items-center justify-center gap-2 px-1 py-2 text-left hover:bg-gray-100"
              >
                <div className="text-sm font-normal leading-[21px] text-slate-800">
                  {sortedType.value}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-y-auto px-4 py-6">
        {alcoholTypeData.map((item: IAlcoholTypeData) => (
          <AlcoholTypeDataThumbnail key={item.id} {...item} />
        ))}
        <div ref={observerRef} />
      </div>

      <div className="relative flex flex-col items-center justify-between pb-10">
        {isFetchingNextPage && <Spinner spinnerVisibility={true} />}
        <AlcoholTypeLoader />
      </div>
    </div>
  );
}
