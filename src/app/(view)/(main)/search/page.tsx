"use client";

import SearchData from "@/_common/SearchData";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { useDebounce } from "@/_utils/useDebounce";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getRelatedSearchData } from "@/app/api/tasting-note/getRelatedSearchData";
import AlcoholSlider from "@/_components/search/AlcoholSlider";
import { useCookies } from "react-cookie";
import Navigation from "@/_common/Navigation";
import SearchHeader from "@/_components/search/SearchHeader";
import { IAlcoholTypeData } from "@/_types/search/alcoholTypeData";
import { IAlcoholSearchData } from "@/_types/search/alcoholSearchData";
import { IAlcoholTypeTab } from "@/_types/search/alcoholTypeTab";
import { IAlcoholSortedType } from "@/_types/search/alcoholSortedType";
import { IAlcoholSearchResult } from "@/_types/search/alcoholSearchResult";
import AlcoholSearchDataSearchResult from "@/_components/search/AlcoholSearchlDataSearchResult";
import RelatedSearchResult from "@/_components/search/RelatedSearchResult";
import RecentSearchList from "@/_components/search/RecentSearchList";
import ScrollUpFloatingBtn from "@/_components/search/ScrollUpFloatingBtn";
import AlcoholTypeData from "@/_components/search/AlcoholTypeData";
import { getAlcoholSearchResult } from "@/app/api/search/getAlcoholSearchResult";
import { getAlcoholTypeResult } from "@/app/api/search/getAlcoholTypeResult";
import DataNotFounded from "@/_components/search/DataNotFounded";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const [isBottom, setIsBottom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [relatedSearchDataList, setRelatedSearchDataList] = useState<string[]>([]);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [searchResult, setSearchResult] = useState<IAlcoholSearchData[]>([]);
  const [openOfficialSearchDataList, setOpenOfficialSearchDataList] = useState(false);
  const [openUnOfficialSearchDataList, setOpenUnOfficialSearchDataList] = useState(false);
  const [openAlcoholTypeDataList, setOpenAlcoholTypeDataList] = useState(false);
  const [alcoholTypeDataCount, setAlcoholTypeDataCount] = useState(0);
  const [alcoholTypeData, setAlcoholTypeData] = useState<IAlcoholTypeData[]>([]);
  const [selectedTab, setSelectedTab] = useState<IAlcoholTypeTab>({
    id: 1,
    value: "탁주",
  });
  const [selectedSortedType, setSelectedSortedType] = useState<IAlcoholSortedType>({
    id: "NAME",
    value: "가나다 순",
  });
  const [lastAlcoholicDrinksName, setLastAlcoholicDrinksName] = useState<string | null>(null);
  const [isTypeDataLast, setIsTypeDataLast] = useState(false);
  const [isSearchDataLast, setIsSearchDataLast] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchAlcoholSearchData = useCallback(async (isReplacing: boolean) => {
    const data = await getAlcoholSearchResult(
      cookies.accessToken,
      searchQuery,
      isReplacing ? null : lastAlcoholicDrinksName,
    );

    if (!data) return;

    setSearchResult((prev) =>
      isReplacing
        ? (data.alcoholicDrinks ?? [])
        : [...prev, ...(data.alcoholicDrinks ?? [])],
    );
    
    setSearchResultCount(data.totalCount ?? 0);
    setIsSearchDataLast(data.isLast ?? false);

    if (data.alcoholicDrinks?.length) {
      setLastAlcoholicDrinksName(
        data.alcoholicDrinks[data.alcoholicDrinks.length - 1].name,
      );
      setOpenOfficialSearchDataList(true);
    } else {
      setOpenUnOfficialSearchDataList(true);
    }
  }, [cookies.accessToken, searchQuery, lastAlcoholicDrinksName]);

  const fetchAlcoholTypeData = useCallback(async (
    isReplacing: boolean,
    tab?: IAlcoholTypeTab,
    sortedType?: IAlcoholSortedType,      
  ) => {
    const data = await getAlcoholTypeResult(
      cookies.accessToken,
      tab?.id ?? selectedTab.id,
      sortedType?.id ?? selectedSortedType.id,
      isReplacing ? undefined : alcoholTypeData[alcoholTypeData.length - 1]?.name,
    );

    if (!data?.alcoholicDrinks) return;
    
    const newData = isReplacing
      ? (data.alcoholicDrinks.content ?? [])
      : [...alcoholTypeData, ...(data.alcoholicDrinks.content ?? [])];
    
    setAlcoholTypeData(newData);
    setAlcoholTypeDataCount(data.totalCount ?? 0);
    setIsTypeDataLast(data.isLast ?? false);
    if (isReplacing) setIsTypeDataLast(false);
  }, [cookies.accessToken, selectedTab.id, selectedSortedType.id, alcoholTypeData]);

  const handleAlcoholTypeClick = useCallback(async (tab: IAlcoholTypeTab) => {
    setSelectedTab(tab);
    setAlcoholTypeData([]); // Clear previous data first
    setOpenAlcoholTypeDataList(true);
    await fetchAlcoholTypeData(true, tab);
  }, [fetchAlcoholTypeData]);

  const handleQuerySearch = useCallback(async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      saveRecentSearchDataToLocalStorage({
        localStorageKey: "TastingNoteRecentSearchList",
        searchData: searchQuery,
      });
      setSearchResultCount(0);
      setSearchResult([]);
      setLastAlcoholicDrinksName(null);
      await fetchAlcoholSearchData(true);
    }
  }, [searchQuery, fetchAlcoholSearchData]);

  const handleSortedType = useCallback(async (sortedType: IAlcoholSortedType) => {
    setSelectedSortedType(sortedType);
    setAlcoholTypeData([]); // Clear previous data first
    await fetchAlcoholTypeData(true, undefined, sortedType);
  }, [fetchAlcoholTypeData]);

  const handleCloseSearchList = useCallback(() => {
    if (openOfficialSearchDataList) {
      setOpenOfficialSearchDataList(false);
    } else if (openUnOfficialSearchDataList) {
      setOpenUnOfficialSearchDataList(false);
    }
    setLastAlcoholicDrinksName(null);
    setIsSearchDataLast(false);
  }, [openOfficialSearchDataList, openUnOfficialSearchDataList]);

  // Fetch related search data when search query changes
  useEffect(() => {
    const getRelatedSearchDataList = async () => {
      if (!debouncedSearchQuery) {
        setRelatedSearchDataList([]);
        return;
      }
      
      const data = await getRelatedSearchData(searchQuery);
      setRelatedSearchDataList(data ?? []);
    };

    getRelatedSearchDataList();
  }, [debouncedSearchQuery, searchQuery]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = async () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

      if (isAtBottom && !isBottom) {
        setIsBottom(true);
        
        if (openAlcoholTypeDataList && !isTypeDataLast) {          
          await fetchAlcoholTypeData(false);
        }
        
        if (openOfficialSearchDataList && !isSearchDataLast && searchResult.length > 0) {
          await fetchAlcoholSearchData(false);
        }
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    isBottom,
    openAlcoholTypeDataList,
    isTypeDataLast,
    openOfficialSearchDataList,
    isSearchDataLast,
    searchResult.length,
    fetchAlcoholTypeData,
    fetchAlcoholSearchData,
  ]);

  // Memoized UI state values
  const showSearchHeader = useMemo(
    () => !openOfficialSearchDataList && !openUnOfficialSearchDataList && !openAlcoholTypeDataList,
    [openOfficialSearchDataList, openUnOfficialSearchDataList, openAlcoholTypeDataList]
  );

  const showSearchData = useMemo(
    () => !openAlcoholTypeDataList && !openOfficialSearchDataList && !openUnOfficialSearchDataList,
    [openAlcoholTypeDataList, openOfficialSearchDataList, openUnOfficialSearchDataList]
  );

  const handleSearchQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const handleCloseAlcoholTypeData = useCallback(() => {
    setOpenAlcoholTypeDataList(false);
    setIsTypeDataLast(false);
  }, []);

  const handleSearchResultUpdate = useCallback((searchResult: IAlcoholSearchResult) => {
    setSearchResultCount(searchResult.totalCount ?? 0);
    setIsSearchDataLast(searchResult.isLast);
    setSearchResult(searchResult.alcoholicDrinks);
    setOpenOfficialSearchDataList(searchResult.alcoholicDrinks.length > 0);
    setOpenUnOfficialSearchDataList(searchResult.alcoholicDrinks.length === 0);
  }, []);

  return (
    <div className="relative h-full w-full max-w-[560px]">
      {showSearchHeader && <SearchHeader />}

      {showSearchData && (
        <div>
          <SearchData
            searchQuery={searchQuery}
            placeholder="전통주 또는 양조장 이름으로 검색해보세요."
            handleChangeQuery={handleSearchQueryChange}
            handleClearSearchQuery={clearSearchQuery}
            handleQuerySearch={handleQuerySearch}
            handleFocus={handleInputFocus}
          />
          <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />
          
          {relatedSearchDataList.length > 0 &&
            relatedSearchDataList.map((data: string, index: number) => (
              <RelatedSearchResult
                key={index}
                searchedData={data}
                searchQuery={debouncedSearchQuery}
                localStorageKey="TastingNoteRecentSearchList"
                setQuery={setSearchQuery}
                setSearchResult={setSearchResult}
                handleOfficialDataSearchList={() => setOpenOfficialSearchDataList(true)}
                handleUnOfficialDataSearchList={() => setOpenUnOfficialSearchDataList(true)}
              />
            ))}

          {debouncedSearchQuery?.length === 0 && (
            isInputFocused ? (
              <RecentSearchList
                localStorageKey="TastingNoteRecentSearchList"
                setSearchQuery={setSearchQuery}
                setSearchResult={handleSearchResultUpdate}
                handleUnOfficialDataSearchList={() => setOpenUnOfficialSearchDataList}
              />
            ) : (
              <AlcoholSlider onAlcoholTypeClick={handleAlcoholTypeClick} />
            )
          )}
        </div>
      )}

      {openAlcoholTypeDataList && (
        <AlcoholTypeData
          totalCount={alcoholTypeDataCount}
          AlcoholSearchTypeDataList={alcoholTypeData}
          selectedTab={selectedTab}
          onTabClick={handleAlcoholTypeClick}
          sortedType={selectedSortedType}
          onSortedTypeClick={handleSortedType}
          isBottom={isBottom}
          isLast={isTypeDataLast}
          handleCloseSearchList={handleCloseAlcoholTypeData}
        />
      )}

      {openOfficialSearchDataList && searchResult.length > 0 && (
        <AlcoholSearchDataSearchResult
          totalCount={searchResultCount}
          officialDataList={searchResult}
          query={searchQuery}
          closeOfficialDataSearchResult={() => setOpenOfficialSearchDataList(false)}
          handleClearSearchQuery={clearSearchQuery}
          handleCloseSearchList={handleCloseSearchList}
          isBottom={isBottom}
          isLast={isSearchDataLast}
        />
      )}

      {openUnOfficialSearchDataList && searchResult.length === 0 && (
        <DataNotFounded
          query={searchQuery}
          closeUnOfficialDataSearchResult={() => {
            setOpenUnOfficialSearchDataList(false);
            setOpenOfficialSearchDataList(false);
          }}
          handleClearSearchQuery={clearSearchQuery}
        />
      )}

      {openAlcoholTypeDataList || openOfficialSearchDataList ? (
        <ScrollUpFloatingBtn />
      ) : (
        <Navigation />
      )}
    </div>
  );
}
