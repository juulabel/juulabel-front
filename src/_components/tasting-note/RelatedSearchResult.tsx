"use client";

import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IRelatedSearchResult {
  searchedData: string;
  searchQuery: string;
  localStorageKey: string;
}

export default function RelatedSearchResult({
  searchedData,
  searchQuery,
  localStorageKey,
}: IRelatedSearchResult) {
  const router = useRouter();
  const [filteredSearchQuery, setFilteredSearchQuery] = useState<string>("");
  useEffect(() => {
    setFilteredSearchQuery(searchedData.replace(searchQuery, ""));
  }, [searchQuery]);

  const onClickRelatedSearchData = () => {
    saveRecentSearchDataToLocalStorage({
      localStorageKey,
      searchData: searchedData,
    });
    //api 요청 후 OfficialDataSearchResult Component 호출
  };
  return (
    <div className="mx-[5%] my-2 flex h-6 items-center">
      <img
        src="/svg/search_icon.svg"
        className="mr-[3px] h-[18px] w-[18px]"
        alt="검색 아이콘"
      />
      <div
        className="flex cursor-pointer flex-row"
        onClick={onClickRelatedSearchData}
      >
        <p className="text-base font-medium text-primary-700">{searchQuery}</p>
        <p className="text-base font-normal text-black">
          {filteredSearchQuery}
        </p>
      </div>
    </div>
  );
}
