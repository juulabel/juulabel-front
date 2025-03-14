"use client";

import { GoChevronLeft } from "react-icons/go";
import Image from "next/image";
import ScrollUpFloatingBtn from "../../search/ScrollUpFloatingBtn";
import OfficialData from "./OfficialData";

interface IOfficialDataSearchResult {
  query: string;
  closeOfficialDataSearchResult: () => void;
  handleClearSearchQuery: () => void;
  handleCloseSearchList: () => void;
}

export default function OfficialDataSearchResult({
  query,
  closeOfficialDataSearchResult,
  handleClearSearchQuery,
  handleCloseSearchList,
}: IOfficialDataSearchResult) {
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
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/search_icon.svg`}
            alt="검색 아이콘"
          />
          <div
            className="w-full"
            onClick={() => closeOfficialDataSearchResult()}
          >
            <input
              className="w-full bg-cool-grayscale-100 focus:outline-none"
              type="text"
              value={query}
              readOnly
            />
          </div>
          <Image
            width={24}
            height={24}
            className="mx-3 cursor-pointer"
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/cancel_icon.svg`}
            alt="취소 아이콘"
            onClick={() => {
              handleClearSearchQuery();
              closeOfficialDataSearchResult();
            }}
          />
        </div>
      </div>
      <OfficialData searchQuery={query} />

      <ScrollUpFloatingBtn />
    </div>
  );
}
