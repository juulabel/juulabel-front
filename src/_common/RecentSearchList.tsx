"use client";

import { IAlcoholSearchResult } from "@/_types/search/alcoholSearchResult";
import { IOfficialData } from "@/_types/tasting-note/officialData";
import { getAlcoholSearchResult } from "@/app/api/search/getAlcoholSearchResult";
import { getOfficialDataList } from "@/app/api/tasting-note/getOfficialDataList";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface IRecentSearchList {
  localStorageKey: string;
  setSearchQuery: (value: string) => void;
  setSearchResult: (data: IAlcoholSearchResult) => void;
  handleUnOfficialDataSearchList: () => void;
  handleOfficialDataSearchList: () => void;
}

export default function RecentSearchList({
  localStorageKey,
  setSearchQuery,
  setSearchResult,
  handleUnOfficialDataSearchList,
  handleOfficialDataSearchList,
}: IRecentSearchList) {
  const [cookies] = useCookies(["accessToken"]);
  const [recentSearchList, setRecentSearchList] = useState<string[]>([]);
  useEffect(() => {
    const localStorageRecentSearchList = localStorage.getItem(localStorageKey);
    const parsedRecentSearchList = localStorageRecentSearchList
      ? JSON.parse(localStorageRecentSearchList)
      : [];
    setRecentSearchList(parsedRecentSearchList);
  }, [localStorageKey]);

  const handleDeleteRecentSearch = (value: string) => {
    const updatedRecentSearchList = recentSearchList.filter(
      (recentSearch: string) => recentSearch !== value,
    );
    setRecentSearchList(updatedRecentSearchList);
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(updatedRecentSearchList),
    );
  };

  const handleRecentSearchListClear = () => {
    localStorage.setItem(localStorageKey, "");
    setRecentSearchList([]);
  };

  const onClickRecentSearchData = async (recentSearch: string) => {
    const data = await getAlcoholSearchResult(
      cookies.accessToken,
      recentSearch,
      null,
    );
    if (data) {
      setSearchQuery(recentSearch);
      setSearchResult(data);
      handleOfficialDataSearchList();
    } else {
      setSearchQuery(recentSearch);
      handleUnOfficialDataSearchList();
    }
  };

  return (
    <div>
      <div className="mx-[4%] my-2 flex justify-between">
        <p className="text-lg font-bold text-cool-grayscale-700">최근 검색어</p>
        <p
          className="cursor-pointer text-base font-medium text-cool-grayscale-500"
          onClick={handleRecentSearchListClear}
        >
          전체 삭제
        </p>
      </div>
      <div>
        {recentSearchList && recentSearchList.length > 0
          ? recentSearchList.map((recentSearch, index: number) => (
              <div
                key={index}
                className="mx-[4%] my-2 flex items-center justify-between"
              >
                <p
                  className="cursor-pointer text-base text-cool-grayscale-700"
                  onClick={() => onClickRecentSearchData(recentSearch)}
                >
                  {recentSearch}
                </p>
                <Image
                  width={16}
                  height={16}
                  src="/images/icons/addingBtn/cancel.png"
                  className="cursor-pointer"
                  alt="취소 버튼"
                  onClick={() => handleDeleteRecentSearch(recentSearch)}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
