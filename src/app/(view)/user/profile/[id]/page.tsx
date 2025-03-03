"use client";

import FollowButton from "@/_common/FollowButton";
import LifeList from "@/_common/LifeList";
import Loading from "@/_common/Loading";
import NoteThumbnail from "@/_common/NoteThumbnail";
import UserHeader from "@/_components/user/UserHeader";
import { ILifeList, INoteThumbnail } from "@/_types/share";
import { cn } from "@/_utils/commons";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { followUser } from "@/app/api/user/followUser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import BadgeInfoModal from "@/_components/share/BadgeInfoModal";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const apiUrl = process.env.NEXT_PUBLIC_JUULABEL_API_URL;
  const imagePath = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH;
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] = useState(false);

  const [contentState, setContentState] = useState({
    lifeList: [] as ILifeList[],
    noteList: [] as INoteThumbnail[],
    lastDailyLifeId: null,
    lastTastingNoteId: null,
    isLifeLast: false,
    isNoteLast: false,
    isFollowed: false,
    isTastingNoteClicked: true,
    isDailyLifeClicked: false,
    isBottom: false,
    followerCount: 0,
  });

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

  useEffect(() => {
    if (user) {
      setContentState((prev) => ({
        ...prev,
        isFollowed: user.isFollowed ?? false,
        followerCount: user.followerCount ?? 0,
      }));
    }
  }, [user]);

  const fetchContent = useCallback(
    async (type: "notes" | "lives") => {
      const isNotes = type === "notes";
      const lastId = isNotes
        ? contentState.lastTastingNoteId
        : contentState.lastDailyLifeId;
      const endpoint = isNotes
        ? `/tasting_notes?pageSize=15${lastId ? `&lastTastingNoteId=${lastId}` : ""}`
        : `/daily-lives?pageSize=15${lastId ? `&lastDailyLifeId=${lastId}` : ""}`;

      try {
        const res = await axios.get(
          `${apiUrl}/v1/api/members/${params.id}${endpoint}`,
          authHeaders,
        );

        const content = isNotes
          ? res.data.result.tastingNoteSummaries
          : res.data.result.dailyLifeSummaries;

        const contentArray = content.content || [];
        const idField = isNotes ? "TastingNoteId" : "dailyLifeId";

        setContentState((prev) => ({
          ...prev,
          [isNotes ? "noteList" : "lifeList"]: contentArray,
          [isNotes ? "isNoteLast" : "isLifeLast"]: content.last,
          [isNotes ? "lastTastingNoteId" : "lastDailyLifeId"]:
            contentArray.length > 0
              ? contentArray[contentArray.length - 1][idField]
              : prev[isNotes ? "lastTastingNoteId" : "lastDailyLifeId"],
        }));
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    },
    [
      params.id,
      authHeaders,
      contentState.lastTastingNoteId,
      contentState.lastDailyLifeId,
      apiUrl,
    ],
  );

  useQuery<INoteThumbnail[]>({
    queryKey: [`${params.id}-note`],
    queryFn: async () => {
      const res = await axios.get(
        `${apiUrl}/v1/api/members/${params.id}/tasting_notes?pageSize=15`,
        authHeaders,
      );

      const notes = res.data.result.tastingNoteSummaries;
      const content = notes.content || [];

      setContentState((prev) => ({
        ...prev,
        isFollowed: res.data.result.isFollowed,
        noteList: content,
        isNoteLast: notes.last,
        lastTastingNoteId:
          content.length > 0 ? content[content.length - 1]?.TastingNoteId : 0,
      }));

      return content;
    },
    enabled: !!cookies.accessToken,
  });

  const handleScroll = useCallback(() => {
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10;

    if (isAtBottom && !contentState.isBottom) {
      setContentState((prev) => ({ ...prev, isBottom: true }));

      if (
        contentState.isTastingNoteClicked &&
        !contentState.isNoteLast &&
        (user?.tastingNoteCount || 0) > 0
      ) {
        fetchContent("notes");
      } else if (
        contentState.isDailyLifeClicked &&
        !contentState.isLifeLast &&
        (user?.dailyLifeCount || 0) > 0
      ) {
        fetchContent("lives");
      }
    } else if (!isAtBottom) {
      setContentState((prev) => ({ ...prev, isBottom: false }));
    }
  }, [contentState, user, fetchContent]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleTabClick = useCallback(
    (type: "notes" | "lives") => {
      setContentState((prev) => ({
        ...prev,
        isTastingNoteClicked: type === "notes",
        isDailyLifeClicked: type === "lives",
      }));

      if (
        type === "lives" &&
        !contentState.isLifeLast &&
        contentState.lifeList.length === 0 &&
        (user?.dailyLifeCount || 0) > 0
      ) {
        fetchContent("lives");
      }
    },
    [contentState.isLifeLast, contentState.lifeList.length, user, fetchContent],
  );

  const handleFollowButton = async () => {
    try {
      await followUser(params.id);
      setContentState((prev) => ({
        ...prev,
        isFollowed: !prev.isFollowed,
        followerCount: prev.followerCount + (prev.isFollowed ? -1 : 1),
      }));

      toast(
        contentState.isFollowed
          ? "팔로우 취소하였습니다."
          : "팔로우 하였습니다.",
      );
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("팔로우 상태 변경에 실패했습니다.");
    }
  };

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  const totalPosts = (user.tastingNoteCount || 0) + (user.dailyLifeCount || 0);
  const defaultProfileImage = `${imagePath}/images/placeholders/profile/default_profile.png`;

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
            isFollowed={contentState.isFollowed}
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
              {contentState.followerCount}
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
            className={`flex h-11 flex-row items-center justify-center border-b-2 ${contentState.isTastingNoteClicked ? "border-black" : "border-cool-grayscale-300"} w-1/2`}
            onClick={() => handleTabClick("notes")}
          >
            <p
              className={`${contentState.isTastingNoteClicked ? "text-base text-black" : "text-cool-grayscale-600"}`}
            >
              시음노트
            </p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {user.tastingNoteCount ?? 0}개
            </p>
          </button>
          <button
            className={`flex h-11 flex-row items-center justify-center border-b-2 ${contentState.isDailyLifeClicked ? "border-black" : "border-cool-grayscale-300"} w-1/2`}
            onClick={() => handleTabClick("lives")}
          >
            <p
              className={`${contentState.isDailyLifeClicked ? "text-base text-black" : "text-cool-grayscale-600"} `}
            >
              일상생활
            </p>
            <p className="ml-1 text-sm text-cool-grayscale-600">
              {user.dailyLifeCount ?? 0}개
            </p>
          </button>
        </div>
      </div>
      <div className="h-full overflow-y-auto px-4 pt-[360px] scrollbar-hide">
        {contentState.isTastingNoteClicked ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-5 overflow-y-auto py-6">
            {contentState.noteList.length > 0 ? (
              contentState.noteList.map((note) => (
                <NoteThumbnail key={note.TastingNoteId} {...note} />
              ))
            ) : (
              <div className="col-span-2 flex h-[calc(100vh-270px)] items-center justify-center">
                <p className="text-base font-medium text-slate-500">
                  작성된 시음노트가 없어요
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {contentState.lifeList.length > 0 ? (
              contentState.lifeList.map((post) => (
                <LifeList key={post.dailyLifeId} {...post} />
              ))
            ) : (
              <div className="flex h-[calc(100vh-270px)] items-center justify-center">
                <p className="text-base font-medium text-slate-500">
                  작성된 일상생활이 없어요
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen} />
      )}
    </div>
  );
}
