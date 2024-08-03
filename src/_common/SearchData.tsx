interface ISearchData {
  searchQuery: string;
  placeholder: string;
  handleClearSearchQuery: () => void;
  handleChangeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQuerySearch?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
//handleQuerySearch를 optional로 한 이유는 handleQuerySearch는 최근 검색어를 저장하는 함수인데 해당 함수를 사용하지 않는 페이지가 있어서 이렇게 처리했습니다

export default function SearchData({
  searchQuery,
  placeholder,
  handleChangeQuery,
  handleClearSearchQuery,
  handleQuerySearch,
}: ISearchData) {
  return (
    <div className="mx-[4%] my-3 flex h-11 flex-row items-center rounded-[6px] bg-cool-grayscale-100">
      <img
        className="mx-[4%] h-[18px] w-[18px]"
        src="/svg/search_icon.svg"
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
      />
      {searchQuery && (
        <img
          className="mx-3 h-6 w-6 cursor-pointer"
          src="/svg/cancel_icon.svg"
          alt="취소 아이콘"
          onClick={handleClearSearchQuery}
        />
      )}
    </div>
  );
}
