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
import { IMyInfo } from "@/_types";
import getMyInfo from "@/app/api/auth/getMyInfo";
import ServerToast from "@/_components/share/error/ServerToast";
import SearchData from "@/_components/tasting-note/search/SearchData";

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
  const [searchQueryResult, setSearchQueryResult] = useState<RecommendedUser[]>(
    [],
  );
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
        router.push("/");
      }
    };

    fetchData();
  }, [debouncedSearchQuery]);

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

      {searchQuery.length > 0 && searchQueryResult.length > 0 && (
        <>
          <span className="mx-[4%] my-4 flex flex-row items-center text-sm text-cool-grayscale-500">
            <p className="text-cool-grayscale-800">
              {searchQueryResult.length}명
            </p>
            의 유저를 찾았어요.
          </span>
          <RecommendedUserList
            recommendedUserList={searchQueryResult}
            userId={user!.memberId!.toString()}
            debouncedSearchQuery={debouncedSearchQuery}
          />
        </>
      )}

      {searchQuery.length > 0 && searchQueryResult.length === 0 && (
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

      {searchQuery.length === 0  && (
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
