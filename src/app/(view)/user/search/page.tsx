"use client";

import TopHeader from "@/_common/TopHeader";
import SearchData from "@/_common/SearchData";
import { useDebounce } from "@/_utils/useDebounce";
import { getSearchUser } from "@/app/api/user/getSearchUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ISearchUser {
  id: string;
  image?: string;
  name: string;
  badge: string[];
}

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const [searchQueryResult, setSearchQueryResult] = useState<ISearchUser[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const handleClearSearchQuery = () => {
    setSearchQuery("");
  };

  const handleClickUser = (id: string) => {
    router.push(`/user/profile/${id}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSearchUser();
      console.log(data);
      setSearchQueryResult(data.data);
    };
    if (debouncedSearchQuery) {
      fetchData();
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    console.log(searchQueryResult);
  }, [searchQueryResult]);

  return (
    <div className="w-full max-w-[560px]">
      <TopHeader title="유저 검색" rest={0} step={0} />
      <SearchData
        searchQuery={searchQuery}
        placeholder="닉네임으로 검색해보세요."
        handleChangeQuery={handleChangeQuery}
        handleClearSearchQuery={handleClearSearchQuery}
      />
      <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />
      {debouncedSearchQuery &&
        (searchQueryResult.length > 0 ? (
          <>
            <span className="mx-[4%] my-4 flex flex-row items-center text-sm text-cool-grayscale-500">
              <p className="text-cool-grayscale-800">
                {searchQueryResult.length}명
              </p>
              의 유저를 찾았어요.
            </span>
            {searchQueryResult.map((user, index) => (
              <div
                key={user.id}
                className={`border-t-[1px] border-cool-grayscale-200 ${index === searchQueryResult.length - 1 ? "border-b-[1px] border-cool-grayscale-200" : ""} `}
              >
                <div
                  className="mx-[4%] my-4 flex items-center justify-between"
                  onClick={() => handleClickUser(user.id)}
                >
                  <div className="flex">
                    <div>
                      <img
                        src={user.image ? user.image : "/images/kakao_icon.png"}
                        alt="유저 이미지"
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <p>{user.name}</p>
                      <div className="flex flex-row">
                        {user.badge.map((badge: string, badgeIndex: number) => (
                          <p key={badgeIndex}>{badge}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <button className="h-8 w-[71px] rounded-[4px] bg-black text-xs font-bold text-white">
                      팔로우 하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="items-cente r flex flex-col justify-center">
              <p className="text-lg font-medium leading-7 text-cool-grayscale-600">
                찾으시는 검색 결 과가 없어요.
              </p>
              <p className="text-base font-normal leading-6 text-cool-grayscale-500">
                단어의 철자가 올바른지 확인해주세요.
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
