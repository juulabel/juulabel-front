"use client";

import Loading from "@/_common/Loading";
import { IOfficialData } from "@/_types/tasting-note/officialData";
import { getOfficialDataList } from "@/app/api/tasting-note/getOfficialDataList";
import { useQuery } from "@tanstack/react-query";
import OfficialDataThumbnail from "./OfficialDataThumbnail";

interface OfficialDataProps {
  officialDataList: IOfficialData[] | [];
}

export default function OfficialData({ officialDataList }: OfficialDataProps) {
  return (
    <>
      <div className="mx-[4%] mt-[3%] flex flex-row items-center">
        <p className="text-base font-bold text-cool-grayscale-500">
          {officialDataList?.length}건
        </p>
        <p className="text-base font-normal text-cool-grayscale-600">
          의 검색 결과가 있어요.
        </p>
      </div>
      <div className="gay-y-5 grid grid-cols-2 gap-x-2 overflow-y-auto px-4 py-6">
        {officialDataList?.map((officialData: IOfficialData) => (
          <OfficialDataThumbnail {...officialData} />
        ))}
      </div>
    </>
  );
}
