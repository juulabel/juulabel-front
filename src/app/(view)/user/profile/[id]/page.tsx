"use client";

import FollowButton from "@/_common/FollowButton";
import LifeList from "@/_components/life/LifeList";
import Loading from "@/_common/Loading";
import NoteThumbnail from "@/_components/tasting-note/NoteThumbnail";
import UserHeader from "@/_components/user/UserHeader";
// import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import { cn } from "@/_utils/commons";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { followUser } from "@/app/api/user/follow/followUser";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import SkeletonUIForUserProfile from "@/_components/share/SkeletonUIForUserProfile";
import LifeListSkeletonList from "@/_components/share/life/SkeletonUIForLifeList";
import SkeletomUIForList from "@/_components/share/SkeletonUIForList";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const apiUrl = process.env.NEXT_PUBLIC_JUULABEL_API_URL;
  const imagePath = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH;
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);
  const [isTastingNoteClicked, setIsTastingNoteClicked] = useState(true);

  const authHeaders = useMemo(
    () => ({
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    }),
    [cookies.accessToken],
  );

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserProfile(params.id),
  });

  const {
    data: noteData,
    fetchNextPage: fetchNextNotePage,
    hasNextPage: hasNextNotePage,
    isFetchingNextPage: isFetchingNextNotePage,
    isLoading: isLoadingNoteList,
  } = useInfiniteQuery({
    queryKey: [`${params.id}-notes`],
    queryFn: async ({ pageParam }) => {
      const lastId = pageParam?.lastTastingNoteId;
      const endpoint = `/tasting_notes?pageSize=15${lastId ? `&lastTastingNoteId=${lastId}` : ""}`;

      const res = await axios.get(
        `${apiUrl}/v1/api/members/${params.id}${endpoint}`,
        authHeaders,
      );

      return res.data.result.tastingNoteSummaries;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      return { lastTastingNoteId: lastPage.content.slice(-1)[0].TastingNoteId };
    },
    initialPageParam: { lastTastingNoteId: null },
    enabled: !!cookies.accessToken && isTastingNoteClicked,
  });

  const {
    data: lifeData,
    isLoading: isLoadingLifeList,
    fetchNextPage: fetchNextLifePage,
    hasNextPage: hasNextLifePage,
    isFetchingNextPage: isFetchingNextLifePage,
  } = useInfiniteQuery({
    queryKey: [`${params.id}-lives`],
    queryFn: async ({ pageParam }) => {
      const lastId = pageParam?.lastDailyLifeId;
      const endpoint = `/daily-lives?pageSize=15${lastId ? `&lastDailyLifeId=${lastId}` : ""}`;

      const res = await axios.get(
        `${apiUrl}/v1/api/members/${params.id}${endpoint}`,
        authHeaders,
      );

      return res.data.result.dailyLifeSummaries;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      return { lastDailyLifeId: lastPage.content.slice(-1)[0].dailyLifeId };
    },
    initialPageParam: { lastDailyLifeId: null },
    enabled: !!cookies.accessToken && !isTastingNoteClicked,
  });

  const noteList = useMemo(
    () => noteData?.pages.flatMap((page) => page.content || []) || [],
    [noteData],
  );

  const lifeList = useMemo(
    () => lifeData?.pages.flatMap((page) => page.content || []) || [],
    [lifeData],
  );

  const observerRef = useInfiniteScroll({
    hasNextPage: isTastingNoteClicked ? hasNextNotePage : hasNextLifePage,
    isFetchingNextPage: isTastingNoteClicked
      ? isFetchingNextNotePage
      : isFetchingNextLifePage,
    fetchNextPage: isTastingNoteClicked ? fetchNextNotePage : fetchNextLifePage,
  });

  const handleTabClick = useCallback((type: "notes" | "lives") => {
    setIsTastingNoteClicked(type === "notes");
  }, []);

  const queryClient = useQueryClient();

  const { mutate: handleFollowButton } = useMutation({
    mutationFn: () => followUser(params.id),
    onMutate: async () => {
      queryClient.setQueryData(
        ["user", params.id],
        (oldData: { isFollowed: boolean; followerCount: number }) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isFollowed: !oldData.isFollowed,
            followerCount:
              oldData.followerCount + (oldData.isFollowed ? -1 : 1),
          };
        },
      );
    },
    onSuccess: ({ id, nickname, isFollowed }) => {
      toast(
        isFollowed
          ? `${nickname}님을 팔로우 취소했어요.`
          : `${nickname}님을 팔로우했어요.`,
      );
    },
    onError: () => {
      toast.error("팔로우 상태 변경에 실패했습니다.");
    },
  });

  if (isLoadingUser) return <SkeletonUIForUserProfile />;

  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  const totalPosts = (user.tastingNoteCount || 0) + (user.dailyLifeCount || 0);
  const defaultProfileImage = `${imagePath}/images/placeholders/profile/default_profile.png`;

  const renderEmptyState = (type: string) => (
    <div className="flex h-[calc(100vh-360px)] items-center justify-center">
      <p className="text-base font-medium text-slate-500">
        작성된 {type}이 없어요
      </p>
    </div>
  );

  return (
    <div className="relative h-full w-full max-w-[560px]">
      <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
        <UserHeader
          title="유저 프로필"
          handleBackButton={() => router.back()}
          bottomBorder={true}
        />

        <div className="mx-[4%] flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <div className="inline-flex h-[72px] w-[72px]">
              <Image
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full"
                src={user.profileImage ?? defaultProfileImage}
                alt="유저 이미지"
              />
            </div>
            <p className="ml-2 text-lg font-bold leading-7">{user.nickname}</p>
            {user.hasBadge && (
              <Image
                onClick={() => setIsBadgeInfoModalOpen(true)}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
                alt="배지"
                className="ml-2"
                width={32}
                height={32}
              />
            )}
          </div>
        </div>
        <div
          className={cn(
            "my-4 flex text-sm font-medium",
            user.introduction
              ? "mx-[4%] text-slate-700"
              : "items-center justify-center text-cool-grayscale-500",
          )}
        >
          {user.introduction ? (
            <p>{user.introduction}</p>
          ) : (
            <p>작성된 자기소개가 없어요</p>
          )}
        </div>

        <div className="flex justify-center">
          <FollowButton
            textSize="sm"
            isFollowed={user.isFollowed}
            onChangeFollow={handleFollowButton}
          />
        </div>
        <div className="mx-[12%] mt-6 flex flex-row items-center justify-between">
          <div
            onClick={() =>
              router.replace(`/user/profile/${params.id}/following`)
            }
            className="flex cursor-pointer flex-col items-center justify-center"
          >
            <p className="text-sm font-normal text-cool-grayscale-500">
              팔로잉
            </p>
            <p className="text-base font-bold text-cool-grayscale-800">
              {user.followingCount ?? 0}
            </p>
          </div>

          <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

          <div
            onClick={() =>
              router.replace(`/user/profile/${params.id}/follower`)
            }
            className="flex cursor-pointer flex-col items-center justify-center"
          >
            <p className="text-sm font-normal text-cool-grayscale-500">
              팔로워
            </p>
            <p className="text-base font-bold text-cool-grayscale-800">
              {user.followerCount ?? 0}
            </p>
          </div>

          <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-normal text-cool-grayscale-500">
              총 게시글
            </p>
            <p className="text-base font-bold text-cool-grayscale-800">
              {totalPosts}
            </p>
          </div>
        </div>
        <div className="flex flex-row pt-4">
          <button
            className={`flex h-11 flex-row items-center justify-center border-b-2 ${isTastingNoteClicked ? "border-black" : "border-cool-grayscale-300"} w-1/2`}
            onClick={() => handleTabClick("notes")}
          >
            <p
              className={`${isTastingNoteClicked ? "text-base text-black" : "text-cool-grayscale-600"}`}
            >
              시음노트
            </p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {user.tastingNoteCount ?? 0}개
            </p>
          </button>
          <button
            className={`flex h-11 flex-row items-center justify-center border-b-2 ${!isTastingNoteClicked ? "border-black" : "border-cool-grayscale-300"} w-1/2`}
            onClick={() => handleTabClick("lives")}
          >
            <p
              className={`${!isTastingNoteClicked ? "text-base text-black" : "text-cool-grayscale-600"} `}
            >
              일상생활
            </p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {user.dailyLifeCount ?? 0}개
            </p>
          </button>
        </div>
      </div>
      <div className="h-full overflow-y-auto px-4 pt-[350px] scrollbar-hide">
        {isTastingNoteClicked ? (
          isLoadingNoteList ? (
            <SkeletomUIForList />
          ) : noteList.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-5 py-6 pb-[70px]">
              {noteList.map((note) => (
                <NoteThumbnail key={note.TastingNoteId} {...note} />
              ))}
              <div ref={observerRef} className="col-span-2 h-4"></div>
            </div>
          ) : (
            renderEmptyState("시음노트")
          )
        ) : (
          <>
            {isLoadingLifeList ? (
              <LifeListSkeletonList />
            ) : lifeList.length > 0 ? (
              <div className="pb-10 pt-3">
                {lifeList.map((post) => (
                  <LifeList key={post.dailyLifeId} {...post} />
                ))}
                <div ref={observerRef} className="h-4"></div>
              </div>
            ) : (
              renderEmptyState("일상생활")
            )}
          </>
        )}
      </div>
      {/* {isBadgeInfoModalOpen && (
        <BadgeInfoModal setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen} />
      )} */}
    </div>
  );
}
