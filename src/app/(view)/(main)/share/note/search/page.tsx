"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getRelatedSearchData } from "@/app/api/tasting-note/getRelatedSearchData";
import RecentSearchList from "@/_components/search/RecentSearchList";
import RelatedSearchResult from "@/_components/search/RelatedSearchResult";
import OfficialDataSearchResult from "@/_components/tasting-note/search/OfficalDataSearchResult";
import SearchData from "@/_components/tasting-note/search/SearchData";
import TastingNoteSearchHeader from "@/_components/tasting-note/search/TastingNoteSearchHeader";
import TraditionalDrinkInformationComponent from "@/_components/tasting-note/search/TraditionalDrinkInformationComponent";
import { useDebounce } from "@/_utils/useDebounce";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [relatedSearchDataList, setRelatedSearchDataList] = useState<string[]>(
    [],
  );
  const [openOfficialSearchDataList, setOpenOfficialSearchDataList] =
    useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    [],
  );

  const handleClearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleCloseSearchList = useCallback(() => {
    setOpenOfficialSearchDataList(false);
  }, []);

  const fetchOfficialDataSearchList = useCallback((recentSearch: string) => {
    setSearchQuery(recentSearch);
    setOpenOfficialSearchDataList(true);
  }, []);

  // Fetch related search data when search query changes
  useEffect(() => {
    if (!debouncedSearchQuery) {
      setRelatedSearchDataList([]);
      return;
    }

    const getRelatedSearchDataList = async () => {
      const data = await getRelatedSearchData(searchQuery);
      setRelatedSearchDataList(data ?? []);
    };

    getRelatedSearchDataList();
  }, [debouncedSearchQuery, searchQuery]);

  const renderRelatedResults = useMemo(
    () =>
      relatedSearchDataList.map((data: string, index: number) => (
        <RelatedSearchResult
          key={index}
          searchedData={data}
          searchQuery={debouncedSearchQuery}
          localStorageKey="TastingNoteRecentSearchList"
          fetchOfficialDataSearchList={fetchOfficialDataSearchList}
        />
      )),
    [relatedSearchDataList, debouncedSearchQuery, fetchOfficialDataSearchList],
  );

  const renderRecentSearches = useMemo(
    () => (
      <>
        <RecentSearchList
          localStorageKey="TastingNoteRecentSearchList"
          fetchOfficialDataSearchList={fetchOfficialDataSearchList}
        />
        <div className="absolute bottom-[21%] left-1/2 translate-x-[-50%]">
          <TraditionalDrinkInformationComponent />
        </div>
      </>
    ),
    [fetchOfficialDataSearchList],
  );

  const closeOfficialDataSearchResult = useCallback(
    () => setOpenOfficialSearchDataList(false),
    [],
  );

  return (
    <>
      {!openOfficialSearchDataList ? (
        <div className="h-full w-full max-w-[560px]">
          <TastingNoteSearchHeader title="시음노트 작성하기" />
          <SearchData
            searchQuery={searchQuery}
            placeholder="전통주 또는 양조장 이름으로 검색해보세요."
            handleChangeQuery={handleChangeSearchQuery}
            handleClearSearchQuery={handleClearSearchQuery}
            fetchOfficialDataSearchList={fetchOfficialDataSearchList}
          />
          <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />
          {searchQuery ? renderRelatedResults : renderRecentSearches}
        </div>
      ) : (
        <OfficialDataSearchResult
          query={searchQuery}
          closeOfficialDataSearchResult={closeOfficialDataSearchResult}
          handleClearSearchQuery={handleClearSearchQuery}
          handleCloseSearchList={handleCloseSearchList}
        />
      )}
    </>
  );
}
