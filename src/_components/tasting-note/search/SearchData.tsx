import Image from "next/image";
import saveRecentSearchDataToLocalStorage from "@/_utils/saveRecentSearchDataToLocalStorage";

interface ISearchData {
  searchQuery: string;
  placeholder: string;
  handleClearSearchQuery: () => void;
  handleChangeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetchOfficialDataSearchList?: (recentSearch: string) => void;
  setIsInputFocused?: (isInputFocused: boolean) => void;
}
//handleQuerySearch를 optional로 한 이유는 handleQuerySearch는 최근 검색어를 저장하는 함수인데 해당 함수를 사용하지 않는 페이지가 있어서 이렇게 처리했습니다

export default function SearchData({
  searchQuery,
  placeholder,
  handleChangeQuery,
  handleClearSearchQuery,
  fetchOfficialDataSearchList,
  setIsInputFocused,
}: ISearchData) {
  const handleQuerySearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!fetchOfficialDataSearchList) return;
    if (event.key === "Enter") {
      saveRecentSearchDataToLocalStorage({
        localStorageKey: "TastingNoteRecentSearchList",
        searchData: searchQuery,
      });
      fetchOfficialDataSearchList(searchQuery);
    }
  };

  return (
    <div className="mx-[4%] my-3 flex h-11 flex-row items-center rounded-[6px] bg-cool-grayscale-100">
      <Image
        width={18}
        height={18}
        className="mx-[4%]"
        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/search_icon.svg`}
        alt="검색 아이콘"
      />
      <input
        className="w-full bg-cool-grayscale-100 focus:outline-none"
        type="text"
        value={searchQuery}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleChangeQuery(event)
        }
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
          handleQuerySearch ? handleQuerySearch(event) : null
        }
        placeholder={placeholder}
        onFocus={() => setIsInputFocused?.(true)}
      />
      {searchQuery && (
        <Image
          width={24}
          height={24}
          className="mx-3 cursor-pointer"
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/cancel_icon.svg`}
          alt="취소 아이콘"
          onClick={handleClearSearchQuery}
        />
      )}
    </div>
  );
}
