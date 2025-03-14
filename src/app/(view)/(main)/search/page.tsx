"use client";

import SearchData from "@/_components/tasting-note/search/SearchData";
import { useDebounce } from "@/_utils/useDebounce";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getRelatedSearchData } from "@/app/api/tasting-note/getRelatedSearchData";
import AlcoholSlider from "@/_components/search/AlcoholSlider";
import Navigation from "@/_common/Navigation";
import SearchHeader from "@/_components/search/SearchHeader";
import RelatedSearchResult from "@/_components/search/RelatedSearchResult";
import RecentSearchList from "@/_components/search/RecentSearchList";
import ScrollUpFloatingBtn from "@/_components/search/ScrollUpFloatingBtn";
import AlcoholTypeData from "@/_components/search/AlcoholTypeData";
import OfficialDataSearchResult from "@/_components/tasting-note/search/OfficalDataSearchResult";
import { IAlcoholTypeTab } from "@/_types/search/alcoholTypeTab";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [relatedSearchDataList, setRelatedSearchDataList] = useState<string[]>([]);
  const [openOfficialSearchDataList, setOpenOfficialSearchDataList] = useState(false);
  const [openAlcoholTypeDataList, setOpenAlcoholTypeDataList] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState<IAlcoholTypeTab>({
    id: 1,
    value: "탁주",
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const handleSearchQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleCloseAlcoholTypeData = useCallback(() => {
    setOpenAlcoholTypeDataList(false);
  }, []);

  const fetchOfficialDataSearchList = useCallback((recentSearch: string) => {
    setSearchQuery(recentSearch);
    setOpenOfficialSearchDataList(true);
  }, []);

  const handleAlcoholTypeClick = useCallback((tab: IAlcoholTypeTab) => {
    setSelectedTab(tab);
    setOpenAlcoholTypeDataList(true);
  }, []);

  const closeOfficialDataSearchResult = useCallback(() => {
    setOpenOfficialSearchDataList(false);
  }, []);

  const handleSearchClick = useCallback(() => {
    setSearchQuery("");
    setIsInputFocused(false);
  }, []);

  const isSearchListOpen = useMemo(() => 
    openOfficialSearchDataList || openAlcoholTypeDataList, 
    [openOfficialSearchDataList, openAlcoholTypeDataList]
  );
  
  const showMainContent = useMemo(() => 
    !openOfficialSearchDataList && !openAlcoholTypeDataList,
    [openOfficialSearchDataList, openAlcoholTypeDataList]
  );
  
  const showRecentSearches = useMemo(() => 
    debouncedSearchQuery?.length === 0 && isInputFocused,
    [debouncedSearchQuery, isInputFocused]
  );
  
  const showAlcoholSlider = useMemo(() => 
    debouncedSearchQuery?.length === 0 && !isInputFocused,
    [debouncedSearchQuery, isInputFocused]
  );

  return (
    <div className="relative h-full w-full max-w-[560px]">
      {showMainContent && <SearchHeader />}

      {showMainContent && (
        <div>
          <SearchData
            searchQuery={searchQuery}
            placeholder="전통주 또는 양조장 이름으로 검색해보세요."
            handleClearSearchQuery={clearSearchQuery}
            handleChangeQuery={handleSearchQueryChange}
            fetchOfficialDataSearchList={fetchOfficialDataSearchList}
            setIsInputFocused={setIsInputFocused}
          />
          <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />

          {relatedSearchDataList.length > 0 && 
            relatedSearchDataList.map((data: string, index: number) => (
              <RelatedSearchResult
                key={index}
                searchedData={data}
                searchQuery={debouncedSearchQuery}
                localStorageKey="TastingNoteRecentSearchList"
                fetchOfficialDataSearchList={fetchOfficialDataSearchList}
              />
            ))}

          {showRecentSearches && (
            <RecentSearchList
              localStorageKey="TastingNoteRecentSearchList"
              fetchOfficialDataSearchList={fetchOfficialDataSearchList}
            />
          )}

          {showAlcoholSlider && (
            <AlcoholSlider onAlcoholTypeClick={handleAlcoholTypeClick} />
          )}
        </div>
      )}

      {openAlcoholTypeDataList && (
        <AlcoholTypeData
          handleCloseSearchList={handleCloseAlcoholTypeData}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {openOfficialSearchDataList && (
        <OfficialDataSearchResult
          query={searchQuery}
          closeOfficialDataSearchResult={closeOfficialDataSearchResult}
          handleClearSearchQuery={clearSearchQuery}
          handleCloseSearchList={closeOfficialDataSearchResult}
        />
      )}

      {isSearchListOpen ? (
        <ScrollUpFloatingBtn />
      ) : (
        <Navigation handleSearchClick={handleSearchClick} />
      )}
    </div>
  );
}
