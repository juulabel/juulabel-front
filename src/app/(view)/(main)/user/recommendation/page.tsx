"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { getSearchUser } from "@/app/api/user/getSearchUser";
import { getUserRecommendation } from "@/app/api/user/getUserRecommendations";
import FollowHeader from "@/_components/follow/FollowHeader";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import UserListSkeleton from "@/_components/follow/UserListSkeleton";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import ServerToast from "@/_components/share/error/ServerToast";
import SearchData from "@/_components/tasting-note/search/SearchData";
import Loading from "@/_common/Loading";
import useMemberStore from "@/_store/memberStore";
import { RecommendedUser } from "@/_types/user/recommendedUser";
import { useDebounce } from "@/_utils/useDebounce";
import { alcoholType } from "@/_config/alcoholType";
import { IMyInfo } from "@/_types";

// Memoize constant values
const IMAGE_BASE_PATH = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH;
const BUCKET_SVG = `${IMAGE_BASE_PATH}/svg/bucket.svg`;
const CLOSE_ICON_SVG = `${IMAGE_BASE_PATH}/svg/close_icon.svg`;
const KISA_BADGE_PNG = `${IMAGE_BASE_PATH}/images/kisa-badge.png`;

interface IUserRecommendation {
  badgeRecommendUser: {
    content: RecommendedUser[];
  };
  tastingRecommendUser: {
    content: RecommendedUser[];
  };
}

export default function Page() {
  const router = useRouter();

  // State management
  const [recommendedSommelier, setRecommendedSommelier] =
    useState<IUserRecommendation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryResult, setSearchQueryResult] = useState<RecommendedUser[]>(
    [],
  );
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] =
    useState<boolean>(false);
  const [badgeLastUserId, setBadgeLastUserId] = useState<number | null>(null);
  const [tastingLastUserId, setTastingLastUserId] = useState<number | null>(
    null,
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  // Memoized callbacks
  const handleChangeQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    [],
  );

  const handleClearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleBadgeInfoModalToggle = useCallback(() => {
    setIsBadgeInfoModalOpen((prev) => !prev);
  }, []);

  const { setMemberInfo } = useMemberStore();

  // User data query
  const {
    data: me,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<IMyInfo>({
    queryKey: ["my-info"],
    queryFn: getMyInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const fetchRecommendedSommelier = async () => {
    setRecommendedSommelier(null);
    const data = await getUserRecommendation({
      badgeLastUserId: badgeLastUserId,
      tastingLastUserId: tastingLastUserId,
    });
    setRecommendedSommelier(data);
    if (data?.badgeRecommendUser?.content.length > 0) {
      setBadgeLastUserId(data?.badgeRecommendUser?.content[0].id);
    }
    if (data?.tastingRecommendUser?.content.length > 0) {
      setTastingLastUserId(data?.tastingRecommendUser?.content[0].id);
    }
  };

  useEffect(() => {
    if (me) {
      setMemberInfo(me);
    }
  }, [me]);

  useEffect(() => {
    fetchRecommendedSommelier();
  }, []);

  const handleRefetch = useCallback(() => {
    fetchRecommendedSommelier();
  }, [fetchRecommendedSommelier]);

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (!debouncedSearchQuery) {
      setSearchQueryResult([]);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getSearchUser({
          lastFollowId: 0,
          pageSize: 10,
          username: debouncedSearchQuery,
        });

        if (isMounted) {
          setSearchQueryResult(data.result.followers.content);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        if (isMounted) {
          setSearchQueryResult([]);
          router.push("/");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchQuery, router]);

  // Memoized derived values

  const hasSearchResults = useMemo(
    () => searchQuery.length > 0 && searchQueryResult.length > 0,
    [searchQuery.length, searchQueryResult.length],
  );

  const noSearchResults = useMemo(
    () => searchQuery.length > 0 && searchQueryResult.length === 0,
    [searchQuery.length, searchQueryResult.length],
  );

  const showRecommendations = useMemo(
    () => searchQuery.length === 0,
    [searchQuery.length],
  );

  const badgeRecommendations = useMemo(
    () => recommendedSommelier?.badgeRecommendUser?.content,
    [me?.hasBadge, recommendedSommelier?.badgeRecommendUser?.content],
  );

  const tastingRecommendations = useMemo(
    () => recommendedSommelier?.tastingRecommendUser?.content,
    [recommendedSommelier?.tastingRecommendUser?.content],
  );

  // Loading and error states
  if (isLoadingUser) return <Loading />;
  if (userError) {
    return (
      <ServerToast
        text="데이터를 불러오는데 실패했어요."
        redirectPath="/"
        cookieDelete
      />
    );
  }

  return (
    <div className="h-full w-full max-w-[560px]">
      <FollowHeader title="팔로우하기" onRefreshClick={handleRefetch} />
      <SearchData
        searchQuery={searchQuery}
        placeholder="닉네임으로 검색해보세요."
        handleChangeQuery={handleChangeQuery}
        handleClearSearchQuery={handleClearSearchQuery}
      />
      <div className="mb-4 h-[1px] w-full bg-cool-grayscale-300" />

      {hasSearchResults && (
        <>
          <span className="mx-[4%] my-4 flex flex-row items-center text-sm text-cool-grayscale-500">
            <p className="text-cool-grayscale-800">
              {searchQueryResult.length}명
            </p>
            의 유저를 찾았어요.
          </span>
          <RecommendedUserList
            type="recommendation"
            recommendedUserList={searchQueryResult}
            debouncedSearchQuery={debouncedSearchQuery}
            onBadgeClick={handleBadgeInfoModalToggle}
          />
        </>
      )}

      {noSearchResults && (
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

      {showRecommendations && (
        <>
          <>
            <p className="mx-[4%] text-base font-medium leading-6 text-cool-grayscale-800">
              소믈리에 추천
            </p>
            {!me?.hasBadge ? (
              <div className="flex flex-col items-center justify-center gap-2 pb-[26px] pt-[29px]">
                <div className="flex flex-row items-center justify-center gap-2 pb-[10px]">
                  <Image src={BUCKET_SVG} alt="배지" width={40} height={40} />
                  <Image
                    src={CLOSE_ICON_SVG}
                    alt="배지"
                    width={20}
                    height={20}
                  />
                  <Image
                    src={KISA_BADGE_PNG}
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
                <button
                  onClick={handleBadgeInfoModalToggle}
                  className="w-[233px] items-center justify-center gap-2.5 overflow-hidden rounded bg-slate-950 p-2 pt-[8px]"
                >
                  <div className="relative justify-center text-center text-xs font-bold leading-none text-white">
                    뱃지 신청하기
                  </div>
                </button>
              </div>
            ) : (
              <>
                <div className="mx-[4%] pb-[16px] text-sm leading-5 text-cool-grayscale-500">
                  <p>주라벨 서비스 내에서 인증을 통해 소믈리에</p>
                  <p>뱃지를 얻은 사람들이에요.</p>
                </div>
                {!badgeRecommendations ? (
                  <UserListSkeleton count={5} />
                ) : (
                  <RecommendedUserList
                    type="recommendation"
                    recommendedUserList={badgeRecommendations}
                    onBadgeClick={handleBadgeInfoModalToggle}
                  />
                )}
              </>
            )}
          </>

          <div className="mx-[4%] py-[16px]">
            <p className="text-base font-medium text-cool-grayscale-800">
              내 취향과 비슷한 유저들
            </p>
            <div className="text-sm text-cool-grayscale-500">
              <span className="flex flex-row">
                <p>선호하는 주종인</p>
                <p className="mx-1 text-cool-grayscale-700">
                  {me?.alcoholTypeIds
                    ?.map(
                      (id) =>
                        alcoholType.find((type) => type.key === id)?.value,
                    )
                    .join(", ")}
                </p>
              </span>
              <p>를 좋아하는 사람들이에요.</p>
            </div>
          </div>

          {!tastingRecommendations ? (
            <UserListSkeleton count={5} />
          ) : (
            <RecommendedUserList
              type="recommendation"
              recommendedUserList={tastingRecommendations}
              onBadgeClick={handleBadgeInfoModalToggle}
            />
          )}
        </>
      )}
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal
          showApplyButton={!me?.hasBadge}
          setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen}
        />
      )}
    </div>
  );
}
