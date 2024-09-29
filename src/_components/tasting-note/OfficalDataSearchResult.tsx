"use client";

import { useEffect, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import OfficialData from "./OfficialData";
import { IOfficialData } from "@/_types/tasting-note/officialData";
import Image from "next/image";

interface IOfficialDataSearchResult {
  query: string;
  officialDataList: IOfficialData[] | []; //임시 데이터 타입
  closeOfficialDataSearchResult: () => void;
  handleClearSearchQuery: () => void;
  handleCloseSearchList: () => void;
}

export default function OfficialDataSearchResult({
  query,
  officialDataList,
  closeOfficialDataSearchResult,
  handleClearSearchQuery,
  handleCloseSearchList,
}: IOfficialDataSearchResult) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <div className="w-full max-w-[560px]">
      <div className="mx-[2%] my-2 flex flex-row items-center">
        <div className="mx-[2%] cursor-pointer">
          <GoChevronLeft size={24} onClick={handleCloseSearchList} />
        </div>
        <div className="flex h-11 w-full flex-row items-center rounded-[6px] bg-cool-grayscale-100">
          <Image
            width={18}
            height={18}
            className="mx-[4%]"
            src="/svg/search_icon.svg"
            alt="검색 아이콘"
          />
          <div
            className="w-full"
            onClick={() => closeOfficialDataSearchResult()}
          >
            <input
              className="w-full bg-cool-grayscale-100 focus:outline-none"
              type="text"
              value={searchQuery}
            />
          </div>
          <Image
            width={24}
            height={24}
            className="mx-3 cursor-pointer"
            src="/svg/cancel_icon.svg"
            alt="취소 아이콘"
            onClick={() => {
              handleClearSearchQuery();
              closeOfficialDataSearchResult();
            }}
          />
        </div>
      </div>
      <OfficialData officialDataList={officialDataList} />
    </div>
  );
}
