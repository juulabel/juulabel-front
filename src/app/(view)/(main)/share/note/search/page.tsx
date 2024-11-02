"use client";

import RecentSearchList from "@/_components/search/RecentSearchList";
import SearchData from "@/_common/SearchData";
import OfficialDataSearchResult from "@/_components/tasting-note/OfficalDataSearchResult";
import RelatedSearchResult from "@/_components/search/RelatedSearchResult";
import TastingNoteSearchHeader from "@/_components/tasting-note/TastingNoteSearchHeader";
import TraditionalDrinkInformationComponent from "@/_components/tasting-note/TraditionalDrinkInformationComponent";
import UnOfficialDataSearchResult from "@/_components/tasting-note/UnOfficialDataSearchResult";
import { IAlcoholSearchResult } from "@/_types/search/alcoholSearchResult";
import { IOfficialData } from "@/_types/tasting-note/officialData";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";
import { useDebounce } from "@/_utils/useDebounce";
import { getAlcoholSearchResult } from "@/app/api/search/getAlcoholSearchResult";
import { getRelatedSearchData } from "@/app/api/tasting-note/getRelatedSearchData";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [isBottom, setIsBottom] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cookies] = useCookies(["accessToken"]);
  const [relatedSearchDataList, setRelatedSearchDataList] = useState<string[]>(
    [],
  );
  const [searchResult, setSearchResult] = useState<IOfficialData[] | []>([]);
  const [openOfficialSearchDataList, setOpenOfficialSearchDataList] =
    useState<boolean>(false);
  const [openUnOfficialSearchDataList, setOpenUnOfficialSearchDataList] =
    useState<boolean>(false);
  const [lastAlcoholicDrinksName, setLastAlcoholicDrinksName] = useState<
    string | null | undefined
  >(null);
  const [isSearchDataLast, setIsSearchDataLast] = useState(false);

  const handleChangeSearchQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };
  const handleClearSearchQuery = () => {
    setSearchQuery("");
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const getRelatedSearchDataList = async () => {
      const data = await getRelatedSearchData(searchQuery);
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

  return (
    <>
      {!openOfficialSearchDataList && !openUnOfficialSearchDataList && (
        <div className="h-full w-full max-w-[560px]">
          <TastingNoteSearchHeader title="시음노트 작성하기" />
          <SearchData
            searchQuery={searchQuery}
            placeholder="전통주 또는 양조장 이름으로 검색해보세요."
            handleChangeQuery={handleChangeSearchQuery}
            handleClearSearchQuery={handleClearSearchQuery}
            handleQuerySearch={handleQuerySearch}
          />
          <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />
          {relatedSearchDataList.length > 0 &&
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
          {relatedSearchDataList?.length === 0 && (
            <>
              <RecentSearchList
                localStorageKey="TastingNoteRecentSearchList"
                setSearchQuery={(recentSearch: string) =>
                  setSearchQuery(recentSearch)
                }
                setSearchResult={(searchResult: IAlcoholSearchResult) => {
                  setSearchResult(searchResult.alcoholicDrinks);
                  setOpenOfficialSearchDataList(true);
                }}
                handleUnOfficialDataSearchList={() =>
                  setOpenUnOfficialSearchDataList
                }
              />
              <div className="absolute bottom-[21%] left-1/2 translate-x-[-50%]">
                <TraditionalDrinkInformationComponent />
              </div>
            </>
          )}
        </div>
      )}
      {openOfficialSearchDataList && (
        <OfficialDataSearchResult
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
      {openUnOfficialSearchDataList && (
        <UnOfficialDataSearchResult
          query={searchQuery}
          closeUnOfficialDataSearchResult={() =>
            setOpenUnOfficialSearchDataList(false)
          }
          handleClearSearchQuery={handleClearSearchQuery}
        />
      )}
    </>
  );
}
