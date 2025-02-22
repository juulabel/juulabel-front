"use client";

import LifeList from "@/_common/LifeList";
import Loading from "@/_common/Loading";
import Navigation from "@/_common/Navigation";
import NoteThumbnail from "@/_common/NoteThumbnail";
import ServerToast from "@/_components/share/error/ServerToast";
import MySpaceHeader from "@/_components/user/MySpaceHeader";
import { ILifeList, INoteThumbnail } from "@/_types/share";
import { IMySpace } from "@/_types/user/mySpaceData";
import { cn } from "@/_utils/commons";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { getMyLife } from "@/app/api/user/getMyLife";
import { getMyNote } from "@/app/api/user/getMyNote";
import { getMySpace } from "@/app/api/user/getMySpace";

import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const [lifeList, setlifeList] = useState<ILifeList[]>([]);
  const [lastDailyLifeId, setLastDailyLifeId] = useState(null);
  const [isLifeLast, setIsLifeLast] = useState(false);
  const [isTastingNoteClicked, setIsTastingNoteClicked] =
    useState<boolean>(true);
  const [isDailyLifeClicked, setIsDailyLifeClicked] = useState<boolean>(false);

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<IMySpace>({
    queryKey: ["my-space"],
    queryFn: () => getMySpace(cookies.accessToken),
  });

  const {
    data: notes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["my-note"],
    queryFn: ({ pageParam }) =>
      getMyNote({
        accessToken: cookies.accessToken,
        lastNoteId: pageParam.lastNoteId,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.content.length) return null;
      return lastPage.last
        ? null
        : lastPage.content.slice(-1)[0].TastingNoteId || null;
    },
    initialPageParam: { lastNoteId: null },
    select: (data) => {
      return data.pages.flatMap((page) => page.content);
    },
    gcTime: 0,
    staleTime: 0,
  });

  const observerRef = useInfiniteScroll({
    hasNextPage: hasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    fetchNextPage: fetchNextPage,
  });

  useEffect(() => {
    return () => {};
  }, [isFetching, notes, isFetchingNextPage]);

  const handleTastingNoteTab = () => {
    setIsTastingNoteClicked(true);
    setIsDailyLifeClicked(false);
  };
  const handleDailyLifeTab = () => {
    setIsTastingNoteClicked(false);
    setIsDailyLifeClicked(true);
    if (!isLifeLast && user!.myDailyLifeCount > 0) {
      fetchDailyLifes();
    }
  };

  const fetchDailyLifes = async () => {
    const myLife = await getMyLife({
      accessToken: cookies.accessToken,
      lastLifeId: lastDailyLifeId,
    });
    setlifeList(myLife.content);
    setIsLifeLast(myLife.last);
    if (myLife.content.length > 0) {
      setLastDailyLifeId(myLife.content[myLife.content.length - 1].dailyLifeId);
    }
  };

  if (isFetchingNextPage || isLoadingUser) return <Loading />;
  if (userError || isError)
    return <ServerToast text="에러가 발생했습니다" redirectPath="/" />;

  return (
    <>
      {user && (
        <div className="relative h-full w-full max-w-[560px]">
          <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
            <MySpaceHeader title="내 공간" />

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
              <Link href={"/user/my-info"}>
                <Image
                  width={24}
                  height={24}
                  className="r rounded-full"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/right-arrow.svg`}
                  alt="내정보"
                />
              </Link>
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
            <div className="mx-[12%] mt-6 flex flex-row items-center justify-between">
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-normal text-cool-grayscale-500">
                  팔로잉
                </p>
                <p className="text-base font-bold text-cool-grayscale-800">
                  {user.followings ?? 0}
                </p>
              </div>

              <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

              <div className="flex flex-col items-center justify-center">
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
            </div>

            <div className="flex flex-row">
              <button
                className={`flex h-11 flex-row items-center justify-center ${isTastingNoteClicked ? "border-b-2 border-black" : "border-b-2 border-cool-grayscale-300"} w-1/2`}
                onClick={() => handleTastingNoteTab()}
              >
                <p
                  className={`${isTastingNoteClicked ? "text-base text-black" : "text-cool-grayscale-600"}`}
                >
                  시음노트
                </p>
                <p className="ml-1 text-sm text-cool-grayscale-600">
                  {user.myTastingNoteCount}개
                </p>
              </button>
              <button
                className={`flex h-11 flex-row items-center justify-center ${isDailyLifeClicked ? "border-b-2 border-black" : "border-b-2 border-cool-grayscale-300"} w-1/2`}
                onClick={handleDailyLifeTab}
              >
                <p
                  className={`${isDailyLifeClicked ? "text-base text-black" : "text-cool-grayscale-600"} `}
                >
                  일상생활
                </p>
                <p className="ml-1 text-sm text-cool-grayscale-600">
                  {user.myDailyLifeCount}개
                </p>
              </button>
            </div>
          </div>
          <div className="h-full overflow-y-auto pt-[290px] scrollbar-hide">
            {isTastingNoteClicked ? (
              <>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 overflow-y-auto px-4 py-6">
                  {notes && notes.length > 0 ? (
                    notes.map((note) => (
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
                <div ref={observerRef} className="loading-indicator">
                  {isFetchingNextPage ? (
                    <Loading />
                  ) : hasNextPage ? (
                    <p>Loading more...</p>
                  ) : (
                    <br />
                  )}
                </div>
              </>
            ) : (
              <>
                {lifeList && lifeList.length > 0 ? (
                  lifeList.map((post) => (
                    <LifeList key={post.dailyLifeId} {...post} />
                  ))
                ) : (
                  <div className="col-span-2 flex h-[calc(100vh-270px)] items-center justify-center">
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

      <Navigation />
    </>
  );
}
