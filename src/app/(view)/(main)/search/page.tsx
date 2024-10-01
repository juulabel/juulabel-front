"use client";

import RecentSearchList from "@/_common/RecentSearchList";
import RelatedSearchResult from "@/_components/tasting-note/RelatedSearchResult";
import TraditionalDrinkInformationComponent from "@/_components/tasting-note/TraditionalDrinkInformationComponent";
import SearchData from "@/_common/SearchData";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { useDebounce } from "@/_utils/useDebounce";
import { useEffect, useState } from "react";
import OfficialDataSearchResult from "@/_components/tasting-note/OfficalDataSearchResult";
import UnOfficialDataSearchResult from "@/_components/tasting-note/UnOfficialDataSearchResult";
import { getRelatedSearchData } from "@/app/api/tasting-note/getRelatedSearchData";
import { IOfficialData } from "@/_types/tasting-note/officialData";
import AlcoholSlider from "@/_components/search/AlcoholSlider";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const [relatedSearchDataList, setRelatedSearchDataList] = useState<
    string[] | null
  >([]);
  const [searchResult, setSearchResult] = useState<IOfficialData[] | []>([]);
  const [openOfficialSearchDataList, setOpenOfficialSearchDataList] =
    useState<boolean>(false);
  const [openUnOfficialSearchDataList, setOpenUnOfficialSearchDataList] =
    useState<boolean>(false);
  const handleChangeSearchQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };
  const handleClearSearchQuery = () => {
    setSearchQuery("");
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  useEffect(() => {
    //작성하는 동작을 1초 이상 멈추면 연관검색어 API 동작
    const getRelatedSearchDataList = async () => {
      const data = await getRelatedSearchData(searchQuery);
      setRelatedSearchDataList(data);
    };
    if (debouncedSearchQuery) getRelatedSearchDataList();
    else setRelatedSearchDataList([]);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    console.log("SearchResult : ", searchResult);
  }, [searchResult]);

  const handleCloseSearchList = () => {
    if (openOfficialSearchDataList) setOpenOfficialSearchDataList(false);
    else if (openUnOfficialSearchDataList)
      setOpenUnOfficialSearchDataList(false);
  };

  const handleQuerySearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //최근 검색어 저장 기능 => enter 키를 눌러서 검색이 동작했을 때에만 localStorage 저장
    if (event.key === "Enter") {
      saveRecentSearchDataToLocalStorage({
        localStorageKey: "TastingNoteRecentSearchList",
        searchData: searchQuery,
      });
      //api 요청
      setOpenOfficialSearchDataList(true); //임시 테스트용
    }
  };
  return (
    <>
      {!openOfficialSearchDataList && !openUnOfficialSearchDataList && (
        <div>
          <SearchData
            searchQuery={searchQuery}
            placeholder="전통주 또는 양조장 이름으로 검색해보세요."
            handleChangeQuery={handleChangeSearchQuery}
            handleClearSearchQuery={handleClearSearchQuery}
            handleQuerySearch={handleQuerySearch}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
          />
          <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />
          {relatedSearchDataList &&
            relatedSearchDataList.length > 0 &&
            relatedSearchDataList.map((data: string, index: number) => (
              <RelatedSearchResult
                key={index}
                searchedData={data}
                searchQuery={debouncedSearchQuery}
                localStorageKey="TastingNoteRecentSearchList"
                setQuery={(relatedData: string) => setSearchQuery(relatedData)}
                setSearchResult={(data: IOfficialData[]) =>
                  setSearchResult(data)
                }
                handleOfficialDataSearchList={() =>
                  setOpenOfficialSearchDataList(true)
                }
                handleUnOfficialDataSearchList={() =>
                  setOpenUnOfficialSearchDataList(true)
                }
              />
            ))}

          {relatedSearchDataList?.length === 0 &&
            (isInputFocused ? (
              <RecentSearchList
                localStorageKey="TastingNoteRecentSearchList"
                setSearchQuery={(recentSearch: string) =>
                  setSearchQuery(recentSearch)
                }
                setSearchResult={(searchResult: IOfficialData[]) =>
                  setSearchResult(searchResult)
                }
                handleOfficialDataSearchList={() =>
                  setOpenOfficialSearchDataList(true)
                }
                handleUnOfficialDataSearchList={() =>
                  setOpenUnOfficialSearchDataList
                }
              />
            ) : (
              <AlcoholSlider />
            ))}
        </div>
      )}
    </>
  );
}
