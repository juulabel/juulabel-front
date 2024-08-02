"use client";

import TraditionalDrinkInformationComponent from "@/_components/tasting-note/TraditionalDrinkInformationComponent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoChevronLeft } from "react-icons/go";

interface IUnOfficialDataSearchResult {
  query: string;
  closeUnOfficialDataSearchResult: () => void;
  handleClearSearchQuery: () => void;
}

export default function UnOfficialDataSearchResult({
  query,
  closeUnOfficialDataSearchResult,
  handleClearSearchQuery,
}: IUnOfficialDataSearchResult) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <div className="h-full w-full max-w-[560px]">
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
            onClick={() => closeUnOfficialDataSearchResult()}
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
              closeUnOfficialDataSearchResult();
            }}
          />
        </div>
      </div>
      <div className="mt-[24vh] flex flex-col items-center justify-center">
        <img
          src="/tasting-note/unoffical_page_icon.png"
          className="h-[123px] w-[92px]"
          alt="비공식 데이터 사진"
        />
        <p className="my-6 text-lg font-medium text-cool-grayscale-600">
          찾으시는 검색 결과가 없어요.
        </p>
      </div>
      <TraditionalDrinkInformationComponent />
    </div>
  );
}
