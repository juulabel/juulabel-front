"use client";

import LifeList from "@/_common/LifeList";
import Loading from "@/_common/Loading";
import Navigation from "@/_common/Navigation";
import NoteThumbnail from "@/_common/NoteThumbnail";
import MySpaceHeader from "@/_components/user/MySpaceHeader";
import { ILifeList, INoteThumbnail } from "@/_types/share";
import { IMySpace } from "@/_types/user/mySpaceData";
import { cn } from "@/_utils/commons";
import { getMySpace } from "@/app/api/user/getMySpace";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const [lifeList, setlifeList] = useState<ILifeList[]>([]);
  const [lastDailyLifeId, setLastDailyLifeId] = useState(0);
  const [isLifeLast, setIsLifeLast] = useState(false);
  const [noteList, setNoteList] = useState<INoteThumbnail[]>([]);
  const [lastTastingNoteId, setLastTastingNoteId] = useState(0);
  const [isNoteLast, setIsNoteLast] = useState(false);
  const [isTastingNoteClicked, setIsTastingNoteClicked] =
    useState<boolean>(true);
  const [isDailyLifeClicked, setIsDailyLifeClicked] = useState<boolean>(false);
  const [isBottom, setIsBottom] = useState(false);

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery<IMySpace>({
    queryKey: ["my-space"],
    queryFn: () => getMySpace(cookies.accessToken),
  });

  const { data, isLoading } = useQuery<INoteThumbnail[]>({
    queryKey: ["my-notes"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/tasting_notes/my?pageSize=15`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );
      const notes = res.data.result.myTastingNoteSummaries;
      setNoteList(notes.content ?? []);
      setIsNoteLast(notes.last);
      setLastTastingNoteId(
        notes.content[notes.content.length - 1].TastingNoteId ?? 0,
      );
      return notes.content;
    },
  });

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight
      ) {
        if (!isBottom) {
          setIsBottom(true);
          if (
            isTastingNoteClicked &&
            !isNoteLast &&
            user!.myTastingNoteCount > 0
          ) {
            await fetchTastingNotes();
          }
          if (isDailyLifeClicked && !isLifeLast && user!.myDailyLifeCount > 0) {
            await fetchDailyLifes();
          }
        }
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleTastingNoteClick = () => {
    setIsTastingNoteClicked(true);
    setIsDailyLifeClicked(false);
  };
  const handleDailyLifeClick = () => {
    setIsTastingNoteClicked(false);
    setIsDailyLifeClicked(true);
    if (!isLifeLast && user!.myDailyLifeCount > 0) {
      fetchDailyLifes();
    }
  };

  const fetchDailyLifes = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/daily-lives/my?pageSize=15&lastDailyLifeId=${lastDailyLifeId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      },
    );

    const myLife = res.data.result.myDailyLifeSummaries;

    setlifeList(myLife.content);
    setIsLifeLast(myLife.last);
    if (myLife.content.length > 0) {
      setLastDailyLifeId(myLife.content[myLife.content.length - 1].dailyLifeId);
    }
  };

  const fetchTastingNotes = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/tasting_notes/my?pageSize=15&lastTastingNoteId=${lastTastingNoteId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      },
    );

    const myNote = res.data.result.myTastingNoteSummaries;

    setNoteList(myNote.content);
    setIsNoteLast(myNote.last);
    if (myNote.content.length > 0) {
      setLastTastingNoteId(
        myNote.content[myNote.content.length - 1].TastingNoteId,
      );
    }
  };

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;

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
                      "/images/placeholders/profile/default_profile.png"
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
                  src={"/svg/right-arrow.svg"}
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

            <div className="flex flex-row">
              <button
                className={`flex h-11 flex-row items-center justify-center ${isTastingNoteClicked ? "border-b-2 border-black" : "border-b-2 border-cool-grayscale-300"} w-1/2`}
                onClick={() => handleTastingNoteClick()}
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
                onClick={() => handleDailyLifeClick()}
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
          <div className="h-full overflow-y-auto pt-[238px] scrollbar-hide">
            {isTastingNoteClicked ? (
              <>
                {noteList && noteList.length > 0 ? (
                  noteList.map((note) => (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-y-auto px-4 py-6">
                      <NoteThumbnail key={note.TastingNoteId} {...note} />
                    </div>
                  ))
                ) : (
                  <p className="flex h-full items-center justify-center text-base font-medium text-slate-500">
                    작성된 시음노트가 없어요
                  </p>
                )}
              </>
            ) : (
              <>
                {lifeList && lifeList.length > 0 ? (
                  lifeList.map((post) => (
                    <LifeList key={post.dailyLifeId} {...post} />
                  ))
                ) : (
                  <p className="flex h-full items-center justify-center text-base font-medium text-slate-500">
                    작성된 일상생활이 없어요
                  </p>
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
