"use client";

import FollowButton from "@/_common/FollowButton";
import Loading from "@/_common/Loading";
import UserHeader from "@/_components/user/User2Header";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserProfile(Number(params.id)),
  });
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setIsFollowed(user.isFollowed);
    } //데이터 받아오면 팔로우값 변경
  }, [user]);

  const [isTastingNoteClicked, setIsTastingNoteClicked] =
    useState<boolean>(true);
  const [isDailyLifeClicked, setIsDailyLifeClicked] = useState<boolean>(false);

  const handleFollowButton = () => {
    setIsFollowed(!isFollowed);
  };

  const handleTastingNoteClick = () => {
    setIsTastingNoteClicked(true);
    setIsDailyLifeClicked(false);
  };
  const handleDailyLifeClick = () => {
    setIsTastingNoteClicked(false);
    setIsDailyLifeClicked(true);
  };

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;
  return (
    <div className="mx-[4%] w-full max-w-[560px]">
      {user && (
        <div>
          <UserHeader
            id={user.id}
            nickname={user.nickname}
            title="유저 프로필"
          />

          <div className="mx-[4%] flex flex-row justify-between">
            <div className="flex flex-row items-center">
              {user.image ? (
                <Image
                  width={72}
                  height={72}
                  className="rounded-full"
                  src={user.image}
                  alt="유저 이미지"
                />
              ) : (
                <Image
                  width={72}
                  height={72}
                  src="https://via.placeholder.com/72x72"
                  alt="유저 이미지"
                  className="rounded-full"
                />
              )}
              <p className="ml-2 text-lg font-bold leading-7">
                {user.nickname}
              </p>
            </div>
            <div className="mx-[4%] flex flex-row flex-wrap items-center">
              {user.badge.map((badge: string, badgeIndex: number) => (
                <Image
                  width={24}
                  height={24}
                  key={badgeIndex}
                  src="https://via.placeholder.com/24x24"
                  alt={`배지 이미지${badge}`}
                  className="mx-1 rounded-full"
                />
              ))}
            </div>
          </div>
          <div className="my-4 flex items-center justify-center text-sm font-medium text-cool-grayscale-500">
            {user.introduction ? (
              <p>{user.introduction}</p>
            ) : (
              <p>작성된 자기소개가 없어요</p>
            )}
          </div>
          <FollowButton
            textSize="sm"
            isFollowed={isFollowed}
            onChangeFollow={handleFollowButton}
          />
          <div className="mx-[7%] mt-6 flex flex-row justify-between">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-normal text-cool-grayscale-500">
                팔로잉
              </p>
              <p className="text-base font-bold text-cool-grayscale-800">
                {user.followings}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-normal text-cool-grayscale-500">
                팔로워
              </p>
              <p className="text-base font-bold text-cool-grayscale-800">
                {user.followers}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-normal text-cool-grayscale-500">
                총 게시글
              </p>
              <p className="text-base font-bold text-cool-grayscale-800">
                {user.documents}
              </p>
            </div>
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
                3{/* {user.tastingNote.length}개 */}
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
                5{/* {user.dailyLife.length}개 */}
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
