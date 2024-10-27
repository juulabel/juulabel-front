"use client";

import SearchData from "@/_common/SearchData";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { useDebounce } from "@/_utils/useDebounce";
import { useEffect, useState } from "react";
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
  const [isBottom, setIsBottom] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cookies] = useCookies(["accessToken"]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const [relatedSearchDataList, setRelatedSearchDataList] = useState<string[]>(
    [],
  );
  const [searchResult, setSearchResult] = useState<IAlcoholSearchData[] | []>(
    [],
  );
  const [openOfficialSearchDataList, setOpenOfficialSearchDataList] =
    useState<boolean>(false);

  const [openUnOfficialSearchDataList, setOpenUnOfficialSearchDataList] =
    useState<boolean>(false);

  const [openAlcoholTypeDataList, setOpenAlcoholTypeDataList] =
    useState<boolean>(false);

  const [alcoholTypeData, setalcoholTypeData] = useState<
    IAlcoholTypeData[] | []
  >([]);

  const [selectedTab, setSelectedTab] = useState<IAlcoholTypeTab>({
    id: 1,
    value: "탁주",
  });

  const [selectedSortedType, setSelectedSortedType] =
    useState<IAlcoholSortedType>({
      id: "NAME",
      value: "가나다 순",
    });

  const [lastAlcoholicDrinksName, setLastAlcoholicDrinksName] = useState<
    string | null | undefined
  >(null);

  const [isTypeDataLst, setIsTypeDataLst] = useState(false);
  const [isSearchDataLast, setIsSearchDataLast] = useState(false);

  const handleAlcoholTypeClick = async (tab: IAlcoholTypeTab) => {
    setSelectedTab(tab);
    setOpenAlcoholTypeDataList(true);

    fetchAlcoholTypeData(true);
  };

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

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    //작성하는 동작을 1초 이상 멈추면 연관검색어 API 동작
    const getRelatedSearchDataList = async () => {
      const data = await getRelatedSearchData(searchQuery);
      console.log(relatedSearchDataList);

      setRelatedSearchDataList(data ?? []);
    };

    if (debouncedSearchQuery) getRelatedSearchDataList();
    else setRelatedSearchDataList([]);
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight
      ) {
        if (!isBottom) {
          setIsBottom(true);
          if (openAlcoholTypeDataList && !isTypeDataLst) {
            await fetchAlcoholTypeData(false);
          }
          if (openOfficialSearchDataList && !isSearchDataLast) {
            await fetchAlcoholSearchData();
          }
        }
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleCloseSearchList = () => {
    if (openOfficialSearchDataList) setOpenOfficialSearchDataList(false);
    else if (openUnOfficialSearchDataList)
      setOpenUnOfficialSearchDataList(false);
    setLastAlcoholicDrinksName(null);
    setIsSearchDataLast(false);
  };

  const handleQuerySearch = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      saveRecentSearchDataToLocalStorage({
        localStorageKey: "TastingNoteRecentSearchList",
        searchData: searchQuery,
      });

      fetchAlcoholSearchData();
    }
  };

  const handleTab = async (tab: IAlcoholTypeTab) => {
    setSelectedTab(tab);
    await fetchAlcoholTypeData(true);
  };

  const handleSortedType = async (sortedType: IAlcoholSortedType) => {
    setSelectedSortedType(sortedType);
    await fetchAlcoholTypeData(true);
  };

  const fetchAlcoholSearchData = async () => {
    const data = await getAlcoholSearchResult(
      cookies.accessToken,
      searchQuery,
      lastAlcoholicDrinksName,
    );

    setSearchResult(data?.alcoholicDrinks ?? []);
    setIsSearchDataLast(data?.isLast ?? false);
    setLastAlcoholicDrinksName(
      data?.alcoholicDrinks[data.alcoholicDrinks.length - 1].name,
    );

    if (data?.alcoholicDrinks.length ?? 0 > 0) {
      setOpenOfficialSearchDataList(true);
    } else {
      setOpenUnOfficialSearchDataList(true);
    }
  };

  const fetchAlcoholTypeData = async (isReplacing: boolean) => {
    const data = await getAlcoholTypeResult(
      cookies.accessToken,
      selectedTab.id,
      selectedSortedType.id,
    );
    if (isReplacing) {
      setalcoholTypeData(data?.alcoholicDrinks.content ?? []);
    } else {
      setalcoholTypeData((prevList) => [
        ...prevList,
        ...(data?.alcoholicDrinks.content ?? []),
      ]);
    }
    setIsTypeDataLst(data?.isLast ?? false);
  };

  return (
    <div className="relative h-full w-full max-w-[560px]">
      {!openOfficialSearchDataList &&
        !openUnOfficialSearchDataList &&
        !openAlcoholTypeDataList && <SearchHeader />}

      {!openAlcoholTypeDataList &&
        !openOfficialSearchDataList &&
        !openUnOfficialSearchDataList && (
          <div>
            <SearchData
              searchQuery={searchQuery}
              placeholder="전통주 또는 양조장 이름으로 검색해보세요."
              handleChangeQuery={handleChangeSearchQuery}
              handleClearSearchQuery={handleClearSearchQuery}
              handleQuerySearch={handleQuerySearch}
              handleFocus={handleFocus}
            />
            <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />
            { 
            relatedSearchDataList.length > 0 &&
              relatedSearchDataList.map((data: string, index: number) => (
                <RelatedSearchResult
                  key={index}
                  searchedData={data}
                  searchQuery={debouncedSearchQuery}
                  localStorageKey="TastingNoteRecentSearchList"
                  setQuery={(relatedData: string) =>
                    setSearchQuery(relatedData)
                  }
                  setSearchResult={(data: IAlcoholSearchData[]) =>
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

            {debouncedSearchQuery?.length === 0 &&
              (isInputFocused ? (
                <RecentSearchList
                  localStorageKey="TastingNoteRecentSearchList"
                  setSearchQuery={(recentSearch: string) =>
                    setSearchQuery(recentSearch)
                  }
                  setSearchResult={(searchResult: IAlcoholSearchResult) => {
                    setIsSearchDataLast(searchResult.isLast);
                    setSearchResult(searchResult.alcoholicDrinks);
                    if (searchResult.alcoholicDrinks.length > 0) {
                      setOpenOfficialSearchDataList(true);
                    } else {
                      setOpenUnOfficialSearchDataList(true);
                    }
                  }}
                  handleUnOfficialDataSearchList={() =>
                    setOpenUnOfficialSearchDataList
                  }
                />
              ) : (
                <AlcoholSlider onAlcoholTypeClick={handleAlcoholTypeClick} />
              ))}
          </div>
        )}
      {openAlcoholTypeDataList && (
        <AlcoholTypeData
          AlcoholSearchTypeDataList={alcoholTypeData}
          selectedTab={selectedTab}
          onTabClick={handleTab}
          sortedType={selectedSortedType}
          onSortedTypeClick={handleSortedType}
          isBottom={isBottom}
          isLast={isTypeDataLst}
          handleCloseSearchList={() => {
            setOpenAlcoholTypeDataList(false);
            setIsTypeDataLst(false);
          }}
        />
      )}

      {openOfficialSearchDataList && searchResult.length > 0 && (
        <AlcoholSearchDataSearchResult
          officialDataList={searchResult}
          query={searchQuery}
          closeOfficialDataSearchResult={() =>
            setOpenOfficialSearchDataList(false)
          }
          handleClearSearchQuery={handleClearSearchQuery}
          handleCloseSearchList={handleCloseSearchList}
          isBottom={isBottom}
          isLast={isSearchDataLast}
        />
      )}
      {openUnOfficialSearchDataList && searchResult.length == 0 && (
        <DataNotFounded
          query={searchQuery}
          closeUnOfficialDataSearchResult={() => {
            setOpenUnOfficialSearchDataList(false);
            setOpenOfficialSearchDataList(false);
          }}
          handleClearSearchQuery={handleClearSearchQuery}
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
