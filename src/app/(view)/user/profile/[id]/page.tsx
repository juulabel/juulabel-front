"use client";

import FollowButton from "@/_common/FollowButton";
import UserHeader from "@/_components/user/UserHeader";
import UserProfileHeader from "@/_components/user/UserProfileHeader";
import UserProfileStats from "@/_components/user/UserProfileStats";
import UserProfileTabs from "@/_components/user/UserProfileTabs";
import UserProfileContent from "@/_components/user/UserProfileContent";
import SkeletonUIForUserProfile from "@/_components/share/SkeletonUIForUserProfile";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { followUser } from "@/app/api/user/follow/followUser";
import { fetchUserContent } from "@/app/api/user/fetchUserContent";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);
  const [isTastingNoteClicked, setIsTastingNoteClicked] = useState(true);

  // User profile query
  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserProfile(params.id),
  });

  // Follow mutation
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
    onSuccess: () => {
      toast(
        user?.isFollowed
          ? `${user.nickname}님을 팔로우 취소했어요.`
          : `${user.nickname}님을 팔로우했어요.`,
      );
    },
    onError: () => {
      toast.error("팔로우 상태 변경에 실패했습니다.");
    },
  });

  // Tasting notes query
  const {
    data: noteData,
    fetchNextPage: fetchNextNotePage,
    hasNextPage: hasNextNotePage,
    isFetchingNextPage: isFetchingNextNotePage,
    isLoading: isLoadingNoteList,
  } = useInfiniteQuery({
    queryKey: [`${params.id}-notes`],
    queryFn: ({ pageParam }) =>
      fetchUserContent({
        pageParam,
        contentType: "notes",
        userId: params.id,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      return { lastTastingNoteId: lastPage.content.slice(-1)[0].TastingNoteId };
    },
    initialPageParam: { lastTastingNoteId: null },
    enabled: !!cookies.accessToken && isTastingNoteClicked,
  });

  // Daily lives query
  const {
    data: lifeData,
    isLoading: isLoadingLifeList,
    fetchNextPage: fetchNextLifePage,
    hasNextPage: hasNextLifePage,
    isFetchingNextPage: isFetchingNextLifePage,
  } = useInfiniteQuery({
    queryKey: [`${params.id}-lives`],
    queryFn: ({ pageParam }) =>
      fetchUserContent({
        pageParam,
        contentType: "lives",
        userId: params.id,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length || lastPage.last) return null;
      return { lastDailyLifeId: lastPage.content.slice(-1)[0].dailyLifeId };
    },
    initialPageParam: { lastDailyLifeId: null },
    enabled: !!cookies.accessToken && !isTastingNoteClicked,
  });

  // Memoized content lists
  const noteList = useMemo(
    () => noteData?.pages.flatMap((page) => page.content || []) || [],
    [noteData],
  );

  const lifeList = useMemo(
    () => lifeData?.pages.flatMap((page) => page.content || []) || [],
    [lifeData],
  );

  // Infinite scroll observer
  const observerRef = useInfiniteScroll({
    hasNextPage: isTastingNoteClicked ? hasNextNotePage : hasNextLifePage,
    isFetchingNextPage: isTastingNoteClicked
      ? isFetchingNextNotePage
      : isFetchingNextLifePage,
    fetchNextPage: isTastingNoteClicked ? fetchNextNotePage : fetchNextLifePage,
  });

  const handleTabClick = useCallback((isTastingNote: boolean) => {
    setIsTastingNoteClicked(isTastingNote);
  }, []);

  if (isLoadingUser) return <SkeletonUIForUserProfile />;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  const totalPosts = (user.tastingNoteCount || 0) + (user.dailyLifeCount || 0);

  return (
    <div className="relative h-full w-full max-w-[560px]">
      <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
        <UserHeader
          title="유저 프로필"
          handleBackButton={() => router.back()}
          bottomBorder={true}
        />

        <UserProfileHeader
          profileImage={user.profileImage}
          nickname={user.nickname}
          introduction={user.introduction}
          hasBadge={user.hasBadge}
          onBadgeClick={() => setIsBadgeInfoModalOpen(true)}
        />

        <div className="flex justify-center">
          <FollowButton
            textSize="sm"
            isFollowed={user.isFollowed}
            onChangeFollow={() => handleFollowButton()}
          />
        </div>

        <UserProfileStats
          memberId={user.memberId}
          followingCount={user.followingCount ?? 0}
          followerCount={user.followerCount ?? 0}
          totalPosts={totalPosts}
          onFollowingClick={() =>
            router.replace(`/user/profile/${params.id}/following`)
          }
          onFollowerClick={() =>
            router.replace(`/user/profile/${params.id}/follower`)
          }
        />

        <UserProfileTabs
          isTastingNoteActive={isTastingNoteClicked}
          tastingNoteCount={user.tastingNoteCount ?? 0}
          dailyLifeCount={user.dailyLifeCount ?? 0}
          onTabChange={handleTabClick}
        />
      </div>
      <div className="px-4 pt-[350px]">
        <UserProfileContent
          isTastingNoteActive={isTastingNoteClicked}
          noteList={noteList}
          lifeList={lifeList}
          isLoadingNoteList={isLoadingNoteList}
          isLoadingLifeList={isLoadingLifeList}
          isFetchingNextNotes={isFetchingNextNotePage}
          isFetchingNextLives={isFetchingNextLifePage}
          observerRef={observerRef}
          onTabChange={handleTabClick}
          isProfile={true}
        />
      </div>
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen} />
      )}
    </div>
  );
}
