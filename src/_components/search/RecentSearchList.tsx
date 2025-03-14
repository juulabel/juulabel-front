"use client";

import { useEffect, useState } from "react";

interface IRecentSearchList {
  localStorageKey: string;
  fetchOfficialDataSearchList: (recentSearch: string) => void;
}

export default function RecentSearchList({
  localStorageKey,
  fetchOfficialDataSearchList,
}: IRecentSearchList) {
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

  return (
    <div>
      <div className="mx-[4%] my-2 flex justify-between">
        <p className="text-lg font-bold text-cool-grayscale-700">최근 검색어</p>
        <button
          className="cursor-pointer text-base font-medium text-cool-grayscale-500"
          onClick={handleRecentSearchListClear}
        >
          전체 삭제
        </button>
      </div>
      <div>
        {recentSearchList && recentSearchList.length > 0
          ? recentSearchList.map((recentSearch, index: number) => (
              <div
                key={index}
                className="mx-[4%] flex items-center justify-between py-1"
              >
                <p
                  className="cursor-pointer text-base text-cool-grayscale-700"
                  onClick={() => fetchOfficialDataSearchList(recentSearch)}
                >
                  {recentSearch}
                </p>
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/addingBtn/cancel.png`}
                  className="h-[4%] w-[4%] cursor-pointer"
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
