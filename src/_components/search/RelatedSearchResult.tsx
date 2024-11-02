"use client";

import { IAlcoholSearchData } from "@/_types/search/alcoholSearchData";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { getAlcoholSearchResult } from "@/app/api/search/getAlcoholSearchResult";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface IRelatedSearchResult {
  searchedData: string;
  searchQuery: string;
  localStorageKey: string;
  setQuery: (value: string) => void;
  setSearchResult: (data: IAlcoholSearchData[]) => void;
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
  const [cookies] = useCookies(["accessToken"]);
  const [index, setIndex] = useState(-1);
  const [beforeHighlight, setBeforeHighlight] = useState("");
  const [afterHighlight, setAfterHighlight] = useState("");

  useEffect(() => {
    const idx = searchedData.indexOf(searchQuery);
    setIndex(idx);
    setBeforeHighlight(searchedData.slice(0, idx));
    setAfterHighlight(searchedData.slice(idx + searchQuery.length));
  }, [searchQuery, searchedData]);

  const onClickRelatedSearchData = async () => {
    saveRecentSearchDataToLocalStorage({
      localStorageKey,
      searchData: searchedData,
    });
    const data = await getAlcoholSearchResult(
      cookies.accessToken,
      searchedData,
      null,
    );
    if (data) {
      setQuery(searchedData);
      setSearchResult(data.alcoholicDrinks);
      handleOfficialDataSearchList();
    } else {
      setQuery(searchedData);
      handleUnOfficialDataSearchList();
    }
  };
  return (
    index != -1 && (
      <div className="mx-[5%] my-2 flex h-6 items-center">
        <Image
          width={18}
          height={18}
          src="/svg/search_icon.svg"
          className="mr-[3px]"
          alt="검색 아이콘"
        />
        <div
          className="flex cursor-pointer flex-row"
          onClick={onClickRelatedSearchData}
        >
          <p className="text-base font-normal text-black">{beforeHighlight}</p>
          <p className="text-base font-medium text-primary-700">
            {searchQuery}
          </p>
          <p className="text-base font-normal text-black">{afterHighlight}</p>
        </div>
      </div>
    )
  );
}
