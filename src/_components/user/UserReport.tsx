"use client";

import Button from "@/_common/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ReportModalContentProps {
  handleModalClose: () => void;
}

export default function UserReport({
  handleModalClose,
}: ReportModalContentProps) {
  const router = useRouter();
  const [checkNotToLook, setCheckNotToLook] = useState<boolean>(false);

  const handleCheckNotToLookOpen = () => {
    setCheckNotToLook(true);
  };

  const handleCheckNotToLookClose = () => {
    setCheckNotToLook(false);
  };

  const handleReport = () => {
    router.push(`/report/?type=사용자`);
  };

  const handleDontLookAtThePost = () => {
    toast("앞으로 해당 게시물이 보이지 않습니다.");
    router.push("/share/note");
  };

  return (
    <div className="flex w-full flex-col gap-3.5 px-3">
      <Button
        className="h-[40px] w-full rounded bg-secondary text-[14px] text-white"
        onClick={handleReport}
      >
        유저 신고하기
      </Button>
      <Button
        className="h-[40px] w-full rounded bg-secondary text-[14px] text-white"
        onClick={() => {
          handleModalClose(); // 기존 모달 닫고 신고 확인 모달 오픈함
          handleCheckNotToLookOpen();
        }}
      >
        이 유저 게시물 보지 않기
      </Button>
      <Button
        variant="none"
        className="h-[40px] w-full text-[14px] font-semibold text-cool-grayscale-500"
        onClick={handleModalClose}
      >
        닫기
      </Button>
    </div>
  );
}
