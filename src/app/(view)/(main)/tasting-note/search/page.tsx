"use client";

import TastingNoteSearchHeader from "@/_components/tasting-note/TastingNoteSearchHeader";
import SearchUser from "@/_components/user/SearchUser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleChangeSearchQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };
  const handleClearSearchQuery = () => {
    setSearchQuery("");
  };
  return (
    <div className="w-full max-w-[560px]">
      <TastingNoteSearchHeader title="시음노트 작성하기" />
      <SearchUser
        searchQuery={searchQuery}
        placeholder="전통주 또는 양조장 이름으로 검색해보세요."
        handleChangeQuery={handleChangeSearchQuery}
        handleClearSearchQuery={handleClearSearchQuery}
      />
    </div>
  );
}
