interface ISearchUser {
  searchQuery: string;
  placeholder: string;
  handleClearSearchQuery: () => void;
  handleChangeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchUser({
  searchQuery,
  placeholder,
  handleChangeQuery,
  handleClearSearchQuery,
}: ISearchUser) {
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
        placeholder={placeholder}
      />
      {searchQuery && (
        <img
          className="mx-3 h-6 w-6"
          src="/svg/cancel_icon.svg"
          alt="취소 아이콘"
          onClick={handleClearSearchQuery}
        />
      )}
    </div>
  );
}
