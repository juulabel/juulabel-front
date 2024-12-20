"use client";

import OfficialDataThumbnail from "./AlcoholSearchDataThumbnailThumbnail";
import { IAlcoholSearchData } from "@/_types/search/alcoholSearchData";
import { useMemo } from "react";
import AlcoholTypeLoader from "../search/AlcoholTypeLoader";
import Spinner from "./Spinner";

interface AlcoholSearchDataProps {
  totalCount: number;
  officialDataList: IAlcoholSearchData[] | [];
  isBottom: boolean;
  isLast: boolean;
}

export default function AlcoholSearchData({
  totalCount,
  officialDataList,
  isBottom,
  isLast,
}: AlcoholSearchDataProps) {
  const spinnerVisibility = useMemo(
    () => isBottom && !isLast,
    [isBottom, isLast],
  );
  return (
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
        {officialDataList?.map((officialData: IAlcoholSearchData) => (
          <>
            <OfficialDataThumbnail key={officialData.id} {...officialData} />
          </>
        ))}
      </div>
      <div className="relative flex flex-col items-center justify-between pb-10">
        <Spinner spinnerVisibility={spinnerVisibility} />
        <AlcoholTypeLoader />
      </div>
    </>
  );
}
