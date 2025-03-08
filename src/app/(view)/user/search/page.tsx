"use client";

import SearchData from "@/_common/SearchData";
import { useDebounce } from "@/_utils/useDebounce";
import { getSearchUser } from "@/app/api/user/getSearchUser";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { followUser } from "@/app/api/user/follow/followUser";
import Image from "next/image";
import UserHeader from "@/_components/user/UserHeader";
import FollowButton from "@/_common/FollowButton";

interface ISearchUser {
  id: number;
  isFollowed: boolean;
  profileImage?: string;
  nickname: string;
  hasBadge: boolean;
}

const defaultProfileImage = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryResult, setSearchQueryResult] = useState<ISearchUser[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleChangeQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    [],
  );

  const handleClearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClickUser = useCallback(
    (id: number) => {
      router.push(`/user/profile/${id}`);
    },
    [router],
  );

  const handleFollow = useCallback(async (id: number, isFollowed: boolean) => {
    setSearchQueryResult((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isFollowed: !isFollowed } : user,
      ),
    );

    followUser(id.toString());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedSearchQuery) return;

      try {
        const data = await getSearchUser({
          lastFollowId: 0,
          pageSize: 10,
          username: debouncedSearchQuery,
        });
        setSearchQueryResult(data.result.followers.content);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchQueryResult([]);
      }
    };

    fetchData();
  }, [debouncedSearchQuery]);

  const renderHighlightedName = useCallback(
    (nickname: string) => {
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
    },
    [debouncedSearchQuery],
  );

  const hasResults = debouncedSearchQuery && searchQueryResult.length > 0;
  const noResults = debouncedSearchQuery && searchQueryResult.length === 0;

  return (
    <div className="h-full w-full max-w-[560px]">
      <UserHeader
        title="유저 검색"
        handleBackButton={() => router.back()}
        bottomBorder={false}
      />
      <SearchData
        searchQuery={searchQuery}
        placeholder="닉네임으로 검색해보세요."
        handleChangeQuery={handleChangeQuery}
        handleClearSearchQuery={handleClearSearchQuery}
      />
      <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />

      {hasResults && (
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
              className={`border-t-[1px] border-cool-grayscale-200 ${
                index === searchQueryResult.length - 1
                  ? "border-b-[1px] border-cool-grayscale-200"
                  : ""
              }`}
            >
              <div className="mx-[4%] my-4 flex items-center justify-between">
                <div
                  className="flex cursor-pointer"
                  onClick={() => handleClickUser(user.id)}
                >
                  <div>
                    <Image
                      width={44}
                      height={44}
                      src={user.profileImage ?? defaultProfileImage}
                      alt="유저 이미지"
                      className="rounded-full"
                    />
                  </div>
                  <div className="ml-2 flex flex-row items-center gap-2">
                    <p>{renderHighlightedName(user.nickname)}</p>
                    {user.hasBadge && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
                        alt="배지"
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <FollowButton
                    width="18"
                    isFollowed={user.isFollowed}
                    textSize="xs"
                    onChangeFollow={() =>
                      handleFollow(user.id, user.isFollowed)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {noResults && (
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-medium leading-7 text-cool-grayscale-600">
              찾으시는 검색 결과가 없어요.
            </p>
            <p className="text-base font-normal leading-6 text-cool-grayscale-500">
              단어의 철자가 올바른지 확인해주세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
