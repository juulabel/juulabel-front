"use client";

import TopHeader from "@/_common/TopHeader";
import SearchData from "@/_common/SearchData";
import { useDebounce } from "@/_utils/useDebounce";
import { getSearchUser } from "@/app/api/user/getSearchUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { followUser } from "@/app/api/user/followUser";
import Image from "next/image";
import { toast } from "react-toastify";

interface ISearchUser {
  id: number;
  isFollowed: boolean;
  profileImage?: string;
  nickname: string;
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

  const handleClickUser = (id: number) => {
    router.push(`/user/profile/${id}`);
  };

  const handleFollow = async (id: number, isFollowed: boolean) => {
    setSearchQueryResult((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isFollowed: !isFollowed } : user,
      ),
    );

    // Show toast
    if (isFollowed) {
      toast("팔로우 취소하였습니다.");
    } else {
      toast("팔로우 하였습니다.");
    }

    // Make API call in background
    followUser(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSearchUser({
        lastFollowId: 0,
        pageSize: 10,
        username: debouncedSearchQuery,
      });
      setSearchQueryResult(data.result.followers.content);
    };
    if (debouncedSearchQuery) {
      fetchData();
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {}, [searchQueryResult]);

  const renderHighlightedName = (nickname: string) => {
    if (!debouncedSearchQuery) return nickname;

    const index = nickname
      .toLowerCase()
      .indexOf(debouncedSearchQuery.toLowerCase());
    if (index === -1) return nickname;

    return (
      <>
        {nickname.slice(0, index)}
        <span className="text-primary-700">
          {nickname.slice(index, index + debouncedSearchQuery.length)}
        </span>
        {nickname.slice(index + debouncedSearchQuery.length)}
      </>
    );
  };

  return (
    <div className="h-full w-full max-w-[560px]">
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
                <div className="mx-[4%] my-4 flex items-center justify-between">
                  <div
                    className="flex"
                    onClick={() => handleClickUser(user.id)}
                  >
                    <div>
                      <Image
                        width={44}
                        height={44}
                        src={
                          user.profileImage
                            ? user.profileImage
                            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kakao_icon.png`
                        }
                        alt="유저 이미지"
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-2 flex flex-row items-center gap-2">
                      <p>{renderHighlightedName(user.nickname)}</p>
                      {/* <Image
                        width={28}
                        height={28}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/KIAS-뱃지 1.png`}
                        alt="뱃지"
                      /> */}
                    </div>
                  </div>
                  <div className="flex">
                    {user.isFollowed ? (
                      <button
                        onClick={() => handleFollow(user.id, user.isFollowed)}
                        className="h-8 w-[71px] rounded-[4px] border-[1px] border-cool-grayscale-200 bg-white text-xs font-bold text-cool-grayscale-800"
                      >
                        팔로우 취소
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(user.id, user.isFollowed)}
                        className="h-8 w-[71px] rounded-[4px] bg-black text-xs font-bold text-white"
                      >
                        팔로우 하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="items-cente r flex flex-col justify-center">
              <p className="text-lg font-medium leading-7 text-cool-grayscale-600">
                찾으시는 검색 결과가 없어요.
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
