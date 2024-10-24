"use client";

import Link from "next/link";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import UserHeaderModal from "./UserHeaderModal";
import ConfirmModal from "@/_common/ConfirmModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IMySpaceHeader {
  id: number;
  nickname: string;
  title: string;
}

export default function MySpaceHeader({ id, nickname, title }: IMySpaceHeader) {
  const router = useRouter();
  const [isUserOptionModalOpen, setIsUserOptionModalOpen] =
    useState<boolean>(false);
  const [isDoNotSeeUserModalOpen, setIsDoNotSeeUserModalOpen] =
    useState<boolean>(false);
  const handleReportUser = () => {
    router.push(`/user/report/${id}`);
  };

  const handleDoNotSeeUser = () => {
    setIsUserOptionModalOpen(false);
    setIsDoNotSeeUserModalOpen(true);
  };

  const handleDoNotSeeConfirm = () => {
    //api 요청
    //api 요청 성공 시
    setIsDoNotSeeUserModalOpen(false);
    toast(`앞으로 ${nickname}님의 게시물이 보이지 않습니다.`);
  };

  return (
    <div>
      <div className="mx-[4%] mb-4 flex h-16 flex-row items-center justify-between border-b-[1px] border-cool-grayscale-300">
        <div className="text-2xl font-bold">{title}</div>
        <div className="flex space-x-3">
          <Link href="/notification" className="relative">
            <Image
              src="/images/icons/header/notification.png"
              width="32"
              height="32"
              alt="notification"
              className="w-[28px] lg:w-[28px]"
            />
            <div className="absolute -right-0.5 -top-0.5 rounded-[8px] bg-primary-700 px-1 py-[1px] text-center text-[9px] font-medium text-white">
              24
            </div>
          </Link>
        </div>
        {/* <button>
          <Image
            width={32}
            height={32}
            src="/svg/menu_icon.svg"
            alt="Menu Icon"
            onClick={() => setIsUserOptionModalOpen(true)}
          />
        </button>
        {isUserOptionModalOpen && (
          <UserHeaderModal
            reportUser={handleReportUser}
            doNotSeeUser={() => handleDoNotSeeUser()}
            onCloseOption={() => setIsUserOptionModalOpen(false)}
          />
        )}
        {isDoNotSeeUserModalOpen && (
          <ConfirmModal
            modalTitle={`${nickname}님의 모든 게시물을 보지 않으시겠어요?`}
            modalDescription=""
            confirmText="이 유저 게시물 보지 않기"
            cancelText="취소"
            handleConfirm={handleDoNotSeeConfirm}
            handleCancel={() => setIsDoNotSeeUserModalOpen(false)}
          />
        )} */}
      </div>
    </div>
  );
}
