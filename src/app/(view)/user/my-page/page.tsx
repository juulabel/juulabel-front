"use client";

import FollowButton from "@/_common/FollowButton";
import LifeList from "@/_common/LifeList";
import Loading from "@/_common/Loading";
import NoteThumbnail from "@/_common/NoteThumbnail";
import MySpaceHeader from "@/_components/user/MySpaceHeader";
import { ILifeList, INoteThumbnail } from "@/_types/share";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { getMySpace } from "@/app/api/user/getMySpace";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["my-space"],
    queryFn: () => getMySpace(cookies.accessToken),
  });

  const { data: notes, isLoading } = useQuery<INoteThumbnail[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/tasting_notes/my?pageSize=1`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );

      return res.data.result.myDailyLifeSummaries.content;
    },
  });

  const [lifeList, setlifeList] = useState<ILifeList[]>([]);
  const [isListLast, setIsListLast] = useState(false);

  const [isTastingNoteClicked, setIsTastingNoteClicked] =
    useState<boolean>(true);
  const [isDailyLifeClicked, setIsDailyLifeClicked] = useState<boolean>(false);

  const handleTastingNoteClick = () => {
    setIsTastingNoteClicked(true);
    setIsDailyLifeClicked(false);
  };
  const handleDailyLifeClick = () => {
    setIsTastingNoteClicked(false);
    setIsDailyLifeClicked(true);
    if (!isListLast) {
      fetchListList();
    }
  };

  const fetchListList = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives?pageSize=10`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      },
    );
    console.log(res.data.result.dailyLifeSummaries);

    setIsListLast(res.data.result.dailyLifeSummaries.last);
    setlifeList(res.data.result.dailyLifeSummaries.content);
  };

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;

  return (
    <>
      {user && (
        <div className="relative h-full w-full max-w-[560px]">
          <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
            <MySpaceHeader
              id={user.id}
              nickname={user.nickname}
              title="내 공간"
            />

            <div className="mx-[4%] flex flex-row justify-between">
              <div className="flex flex-row items-center">
                <Image
                  width={72}
                  height={72}
                  className="rounded-full"
                  src={
                    user.image ??
                    "/images/placeholders/profile/default_profile.png"
                  }
                  alt="유저 이미지"
                />
                <p className="ml-2 text-lg font-bold leading-7">
                  {user.nickname}
                </p>
              </div>
              <Link href={"/user/myInfo"}>
                <Image
                  width={24}
                  height={24}
                  className="rounded-full"
                  src={"/svg/right-arrow.svg"}
                  alt="내정보"
                />
              </Link>
            </div>
            <div className="my-4 flex items-center justify-center text-sm font-medium text-cool-grayscale-500">
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
              <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-y-auto px-4 py-6">
                {notes?.map((note) => (
                  <NoteThumbnail key={note.TastingNoteId} {...note} />
                ))}
              </div>
            ) : (
              lifeList?.map((post) => (
                <LifeList key={post.dailyLifeId} {...post} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
