"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IRecentSearchList {
  localStorageKey: string;
}

export default function RecentSearchList({
  localStorageKey,
}: IRecentSearchList) {
  const router = useRouter();
  const [recentSearchList, setRecentSearchList] = useState<string[]>([]);
  useEffect(() => {
    const localStorageRecentSearchList = localStorage.getItem(localStorageKey);
    const parsedRecentSearchList = localStorageRecentSearchList
      ? JSON.parse(localStorageRecentSearchList)
      : [];
    setRecentSearchList(parsedRecentSearchList);
  }, []);

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

  const onClickRecentSearchData = () => {
    //해당 데이터가 OD인지 UD인지 API 요청 후 분기처리
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
                  onClick={() => onClickRecentSearchData()}
                >
                  {recentSearch}
                </p>
                <img
                  src="/icons/addingBtn/cancel.png"
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
