"use client";

import FollowButton from "@/_common/FollowButton";
import Loading from "@/_common/Loading";
import Modal from "@/_common/Modal";
import MyInfoHeader from "@/_components/user/MyInfoHeader";
import UserHeader from "@/_components/user/User2Header";
import { cn } from "@/_utils/commons";
import getMyInfo from "@/app/api/user/getMyInfo";
import { getUserProfile } from "@/app/api/user/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMyInfo(cookies.accessToken),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);

  const onPushNotificationClicked = () => {
    setIsNotificationOn(!isNotificationOn);
  };

  const onSignOutClicked = () => {
    setModalOpen(true);
  };

  const onDeleteAccount = () => {};

  useEffect(() => {
    if (user != undefined) {
      setIsNotificationOn(user.isNotificationsAllowed);
    }
  }, [user]);

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;

  return (
    <div className="mx-[8%] h-full w-full max-w-[560px]">
      {user && (
        <div>
          <MyInfoHeader title={"내 정보"} />

          <div className="text-xl font-bold leading-7 text-slate-800">
            {user.nickname}
          </div>
          <div className="text-sm font-normal leading-[21px] text-slate-500">
            {user.email}
          </div>
          <div className="my-4 inline-flex h-[37px] w-[361px] items-center justify-center gap-2.5 rounded bg-slate-100 px-3 py-2">
            <div className="text-center text-sm font-bold leading-[21px] text-slate-500">
              내 정보 수정하기
            </div>
          </div>
          <div className="h-1 bg-slate-100" />
          <div className="flex py-4">
            <div>
              <div className="mb-1 text-base font-bold leading-normal text-slate-700">
                PUSH 알림 설정{" "}
              </div>
              <div className="text-sm font-normal leading-[21px] text-slate-500">
                다른 사용자가 댓글, 좋아요를 달았거나 팔로우를 걸었을때 알림을
                보내드려요
              </div>
            </div>

            <button
              onClick={onPushNotificationClicked}
              className="relative h-6 w-11"
            >
              <div
                className={cn(
                  "absolute left-0 top-0 h-6 w-11 rounded-[13.50px] transition-colors duration-300",
                  isNotificationOn ? "bg-[#ff823b]" : "bg-slate-200",
                )}
              />
              <div
                className={cn(
                  "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all duration-300 ease-in-out",
                  isNotificationOn ? "left-[23px]" : "left-[3px]",
                )}
              />
            </button>
          </div>

          <button
            onClick={onSignOutClicked}
            className="inline-flex w-full border-t-[1px] border-cool-grayscale-100 py-4"
          >
            <div className="text-sm font-medium leading-[21px] text-slate-700">
              로그아웃
            </div>
          </button>
          <button className="inline-flex w-full border-t-[1px] border-cool-grayscale-100 py-4">
            <div className="text-sm font-medium leading-[21px] text-slate-400">
              회원 탈퇴
            </div>
          </button>
        </div>
      )}
      {modalOpen && (
        <Modal
          modalTitle={"정말로 로그아웃 하시겠어요?"}
          primaryBtnText={"확인"}
          handlePrimaryBtn={() => {
            setModalOpen(false);
            // Logout Logic
          }}
          cancelText="취소"
          handleCancel={() => {
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
