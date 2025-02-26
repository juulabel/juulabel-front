"use client";

import FollowButton from "@/_common/FollowButton";
import LifeList from "@/_common/LifeList";
import Loading from "@/_common/Loading";
import NoteThumbnail from "@/_common/NoteThumbnail";
import UserHeader from "@/_components/user/UserHeader";
import { ILifeList, INoteThumbnail } from "@/_types/share";
import { cn } from "@/_utils/commons";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { followUser } from "@/app/api/user/followUser";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);

  const [contentState, setContentState] = useState({
    lifeList: [] as ILifeList[],
    noteList: [] as INoteThumbnail[],
    lastDailyLifeId: 0,
    lastTastingNoteId: 0,
    isLifeLast: false,
    isNoteLast: false,
    isFollowed: false,
    isTastingNoteClicked: true,
    isDailyLifeClicked: false,
    isBottom: false,
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserProfile(params.id),
  });

  useQuery<INoteThumbnail[]>({
    queryKey: [`${params.id}-note`],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/${params.id}/tasting_notes?pageSize=15`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );

      const notes = res.data.result.tastingNoteSummaries;
      setContentState((prev) => ({
        ...prev,
        isFollowed: res.data.result.isFollowed,
        noteList: notes.content ?? [],
        isNoteLast: notes.last,
        lastTastingNoteId:
          notes.content[notes.content.length - 1]?.TastingNoteId ?? 0,
      }));

      return notes.content;
    },
  });

  const fetchContent = useCallback(
    async (type: "notes" | "lives") => {
      const endpoint =
        type === "notes"
          ? `/tasting_notes?pageSize=15&lastTastingNoteId=${contentState.lastTastingNoteId}`
          : `/daily-lives?pageSize=15&lastDailyLifeId=${contentState.lastDailyLifeId}`;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/${params.id}${endpoint}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );

      const content =
        type === "notes"
          ? res.data.result.tastingNoteSummaries
          : res.data.result.dailyLifeSummaries;

      setContentState((prev) => ({
        ...prev,
        [type === "notes" ? "noteList" : "lifeList"]: content.content,
        [type === "notes" ? "isNoteLast" : "isLifeLast"]: content.last,
        [type === "notes" ? "lastTastingNoteId" : "lastDailyLifeId"]:
          content.content.length > 0
            ? content.content[content.content.length - 1][
                type === "notes" ? "TastingNoteId" : "dailyLifeId"
              ]
            : prev[type === "notes" ? "lastTastingNoteId" : "lastDailyLifeId"],
      }));
    },
    [
      params.id,
      cookies.accessToken,
      contentState.lastTastingNoteId,
      contentState.lastDailyLifeId,
    ],
  );

  useEffect(() => {
    const handleScroll = async () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (isAtBottom && !contentState.isBottom) {
        setContentState((prev) => ({ ...prev, isBottom: true }));

        if (
          contentState.isTastingNoteClicked &&
          !contentState.isNoteLast &&
          user?.tastingNoteCount > 0
        ) {
          await fetchContent("notes");
        }
        if (
          contentState.isDailyLifeClicked &&
          !contentState.isLifeLast &&
          user?.dailyLifeCount > 0
        ) {
          await fetchContent("lives");
        }
      } else if (!isAtBottom) {
        setContentState((prev) => ({ ...prev, isBottom: false }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentState, user, fetchContent]);

  const handleTabClick = async (type: "notes" | "lives") => {
    setContentState((prev) => ({
      ...prev,
      isTastingNoteClicked: type === "notes",
      isDailyLifeClicked: type === "lives",
    }));

    if (
      type === "lives" &&
      !contentState.isLifeLast &&
      user?.dailyLifeCount > 0
    ) {
      await fetchContent("lives");
    }
  };

  const handleFollowButton = async () => {
    setContentState((prev) => ({ ...prev, isFollowed: !prev.isFollowed }));
    toast(
      contentState.isFollowed ? "팔로우 취소하였습니다." : "팔로우 하였습니다.",
    );
    await followUser(params.id);
  };

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;

  return (
    <>
      {user && (
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
                    src={
                      user.profileImage ??
                      `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`
                    }
                    alt="유저 이미지"
                  />
                </div>
                <p className="ml-2 text-lg font-bold leading-7">
                  {user.nickname}
                </p>
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

            {/* <div className="flex justify-center">
              <FollowButton
                textSize="sm"
                isFollowed={contentState.isFollowed}
                onChangeFollow={handleFollowButton}
              />
            </div>
            <div className="mx-[12%] mt-6 flex flex-row items-center justify-between">
              <div
                onClick={() =>
                  router.push(`/user/profile/${params.id}/following`)
                }
                className="flex cursor-pointer flex-col items-center justify-center"
              >
                <p className="text-sm font-normal text-cool-grayscale-500">
                  팔로잉
                </p>
                <p className="text-base font-bold text-cool-grayscale-800">
                  {user.followings ?? 0}
                </p>
              </div>

              <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

              <div
                onClick={() =>
                  router.push(`/user/profile/${params.id}/followers`)
                }
                className="flex cursor-pointer flex-col items-center justify-center"
              >
                <p className="text-sm font-normal text-cool-grayscale-500">
                  팔로워
                </p>
                <p className="text-base font-bold text-cool-grayscale-800">
                  {user.followers ?? 0}
                </p>
              </div>

              <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-normal text-cool-grayscale-500">
                  총 게시글
                </p>
                <p className="text-base font-bold text-cool-grayscale-800">
                  {user.documents ?? 0}
                </p>
              </div>
            </div> */}
            <div className="flex flex-row">
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
                  {user.tastingNoteCount}개
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
                  {user.dailyLifeCount}개
                </p>
              </button>
            </div>
          </div>
          <div className="h-full overflow-y-auto px-4 pt-[240px] scrollbar-hide">
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
        </div>
      )}
    </>
  );
}
