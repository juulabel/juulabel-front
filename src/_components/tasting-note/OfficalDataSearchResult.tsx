"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoChevronLeft } from "react-icons/go";

interface IOfficialDataSearchResult {
  query: string;
  officialDataList?: string[]; //임시 데이터 타입
  closeOfficialDataSearchResult: () => void;
  handleClearSearchQuery: () => void;
}

export default function OfficialDataSearchResult({
  query,
  closeOfficialDataSearchResult,
  handleClearSearchQuery,
}: IOfficialDataSearchResult) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <div className="w-full max-w-[560px]">
      <div className="mx-[2%] my-2 flex flex-row items-center">
        <div className="mx-[2%] cursor-pointer">
          <GoChevronLeft size={24} onClick={() => router.back()} />
        </div>
        <div className="flex h-11 w-full flex-row items-center rounded-[6px] bg-cool-grayscale-100">
          <img
            className="mx-[4%] h-[18px] w-[18px]"
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
          <img
            className="mx-3 h-6 w-6 cursor-pointer"
            src="/svg/cancel_icon.svg"
            alt="취소 아이콘"
            onClick={() => {
              handleClearSearchQuery();
              closeOfficialDataSearchResult();
            }}
          />
        </div>
      </div>
    </div>
  );
}
