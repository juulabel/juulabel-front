"use client";

import { IOfficialData } from "@/_types/tasting-note/officialData";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { getOfficialDataList } from "@/app/api/tasting-note/getOfficialDataList";
import { useEffect, useState } from "react";

interface IRelatedSearchResult {
  searchedData: string;
  searchQuery: string;
  localStorageKey: string;
  setQuery: (value: string) => void;
  setSearchResult: (data: IOfficialData[]) => void;
  handleUnOfficialDataSearchList: () => void;
  handleOfficialDataSearchList: () => void;
}

export default function RelatedSearchResult({
  searchedData,
  searchQuery,
  localStorageKey,
  setQuery,
  setSearchResult,
  handleUnOfficialDataSearchList,
  handleOfficialDataSearchList,
}: IRelatedSearchResult) {
  const [filteredSearchQuery, setFilteredSearchQuery] = useState<string>("");
  useEffect(() => {
    setFilteredSearchQuery(searchedData.replace(searchQuery, ""));
  }, [searchQuery]);

  const onClickRelatedSearchData = async () => {
    saveRecentSearchDataToLocalStorage({
      localStorageKey,
      searchData: searchedData,
    });
    const data = await getOfficialDataList();
    if (data) {
      setQuery(searchedData);
      setSearchResult(data);
      handleOfficialDataSearchList();
    } else {
      setQuery(searchedData);
      handleUnOfficialDataSearchList();
    }
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
