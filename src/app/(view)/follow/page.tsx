"use client";

import Loading from "@/_common/Loading";
import FollowHeader from "@/_components/follow/FollowHeader";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import { RecommendedUser } from "@/_types/user/recommendedUser";
import { getRecommendedSommelier } from "@/app/api/user/getRecommendedSommelier";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/_utils/useDebounce";
import { getSearchUser } from "@/app/api/user/getSearchUser";
import Image from "next/image";
import { followUser } from "@/app/api/user/follow/followUser";
import { IMyInfo } from "@/_types";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { toast } from "react-toastify";
import ServerToast from "@/_components/share/error/ServerToast";
import SearchData from "@/_components/tasting-note/search/SearchData";
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
  const {
    data: user,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useQuery<IMyInfo>({
    queryKey: ["my-info"],
    queryFn: getMyInfo,
  });

  const {
    data: recommendedSommelier,
    isLoading: isLoadingRecommendedSommelier,
    error,
  } = useQuery<RecommendedUser[]>({
    queryKey: ["recommendedSommelier"],
    queryFn: getRecommendedSommelier,
  });

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryResult, setSearchQueryResult] = useState<ISearchUser[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

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

  const { mutate: handleFollow } = useMutation({
    mutationFn: ({ id, isFollowed }: { id: number; isFollowed: boolean }) =>
      followUser(id.toString()),
    onSuccess: ({ id, nickname, isFollowed }) => {
      setSearchQueryResult((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isFollowed: !isFollowed } : user,
        ),
      );
      toast(
        isFollowed
          ? `${nickname}님을 팔로우 취소했어요.`
          : `${nickname}님을 팔로우했어요.`,
      );
    },
  });

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

  if (isLoadingRecommendedSommelier) return <Loading />;
  if (error)
    return (
      <ServerToast
        text="데이터를 불러오는데 실패했어요."
        redirectPath="/"
        cookieDelete
      />
    );
  // if (recommendedSommelier) {
  return (
    <div className="h-full w-full max-w-[560px]">
      <FollowHeader title="팔로우하기" />
      <SearchData
        searchQuery={searchQuery}
        placeholder="닉네임으로 검색해보세요."
        handleChangeQuery={handleChangeQuery}
        handleClearSearchQuery={handleClearSearchQuery}
        fetchOfficialDataSearchList={() => {}}
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
                      handleFollow({
                        id: user.id,
                        isFollowed: user.isFollowed,
                      })
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

      {!hasResults && (
        <>
          <div className="mx-[4%]">
            <p className="text-base font-medium leading-6 text-cool-grayscale-800">
              소믈리에 추천
            </p>

            <div className="flex flex-col items-center justify-center gap-2 py-[29px]">
              <div className="flex flex-row items-center justify-center gap-2 pb-[10px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/bucket.svg`}
                  alt="배지"
                  width={40}
                  height={40}
                />
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/close_icon.svg`}
                  alt="배지"
                  width={20}
                  height={20}
                />
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
                  alt="배지"
                  width={40}
                  height={40}
                />
              </div>
              <div className="relative justify-center self-stretch text-center text-sm font-medium leading-[21px] text-slate-800">
                당신의 공간을 더 특별하게
              </div>
              <div className="relative justify-center self-stretch text-center text-sm font-normal leading-[21px] text-slate-600">
                KISA 소믈리에 자격증이 있다면, 지금 바로
                <br />내 공간에서 뱃지를 신청하세요!
              </div>
              <button className="w-[233px] items-center justify-center gap-2.5 overflow-hidden rounded bg-slate-950 p-2 pt-[8px]">
                <div className="relative justify-center text-center text-xs font-bold leading-none text-white">
                  뱃지 신청하기
                </div>
              </button>
            </div>

            {/* <div className="text-sm leading-5 text-cool-grayscale-500">
              <p>주라벨 서비스 내에서 인증을 통해 소믈리에</p>
              <p>뱃지를 얻은 사람들이에요.</p>
            </div> */}
          </div>
          <RecommendedUserList recommendedUserList={[]} userId={"0"} />
          <div className="mx-[4%]">
            <p className="text-base font-medium text-cool-grayscale-800">
              내 취향과 비슷한 유저들
            </p>
            <div className="text-sm text-cool-grayscale-500">
              <span className="flex flex-row">
                <p>선호하는 주종인</p>
                <p className="mx-1 text-cool-grayscale-700">
                  {user?.alcoholTypeIds.join(", ")}
                </p>
              </span>
              <p>를 좋아하는 사람들이에요.</p>
            </div>
          </div>
          <RecommendedUserList recommendedUserList={[]} userId={"0"} />
        </>
      )}
    </div>
  );
}
