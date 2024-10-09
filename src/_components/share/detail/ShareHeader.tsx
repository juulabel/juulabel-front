"use client";
import ModalLayout from "@/_common/ModalLayout";
import ModalWithoutCancel from "@/_common/ModalWithoutCancel";
import Button from "@/_common/ui/Button";
import { useAuthorCheckStore } from "@/_store/tastingDetailAutorCheckStore";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ShareHeader() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [checkNotToLook, setCheckNotToLook] = useState<boolean>(false);
  const { isAuthor } = useAuthorCheckStore();
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleCheckNotToLookOpen = () => {
    setCheckNotToLook(true);
  };

  const handleCheckNotToLookClose = () => {
    setCheckNotToLook(false);
  };

  const handleDontLookAtThePost = () => {
    toast("앞으로 해당 게시물이 보이지 않습니다.");
    router.push("/share/note");
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex h-[64px] w-full items-center justify-between border-b border-gray-300 bg-white px-3">
        <div
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        >
          <Image
            src={"/svg/left_arrow.svg"}
            width={32}
            height={32}
            alt="left"
          />
        </div>
        <div className="text-[18px] font-semibold text-[#334155]">
          전통주 시음노트
        </div>
        <div>
          {isAuthor && (
            <Image
              src={"/svg/three_dots_horizontal.svg"}
              width={28}
              height={28}
              alt="three dots"
              className={clsx("animate-fadeIn cursor-pointer")}
              onClick={handleModalOpen}
            />
          )}
        </div>
      </div>
      {modalOpen && (
        <ModalLayout onClose={handleModalClose}>
          <VisitorsModalContent
            handleModalClose={handleModalClose}
            handleCheckNotToLookOpen={handleCheckNotToLookOpen}
          />
          {/* <OwnerModalContent handleModalClose={handleModalClose} /> */}
        </ModalLayout>
      )}

      {/*  1차 MVP에서 안나감
      {checkNotToLook && (
        <ModalLayout onClose={handleCheckNotToLookClose}>
          <section className="flex flex-col gap-1">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={"/svg/warning.svg"}
                width={40}
                height={40}
                alt="경고"
              />

              <div className="text-center text-[18px] font-semibold text-cool-grayscale-800">
                정말 해당 게시물을 보지 않으시겠어요?
              </div>

              <div className="text-center text-[16px] font-normal text-cool-grayscale-600">
                한번 보지 않기로 한 게시물은 되돌릴 수 없어요.
              </div>
            </div>
            <Button
              variant="black"
              className="mt-5 h-[40px] w-full text-[14px]"
              onClick={handleDontLookAtThePost}
            >
              이 게시물 보지 않기
            </Button>
            <Button variant="none" className="h-[40px] w-full text-[14px]">
              취소
            </Button>
          </section>
        </ModalLayout>
      )} */}
    </>
  );
}

function VisitorsModalContent({
  handleModalClose,
  handleCheckNotToLookOpen,
}: {
  handleModalClose: () => void;
  handleCheckNotToLookOpen: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3.5 px-3">
      <Button variant="black" className="h-[40px] w-full text-[14px]">
        게시물 신고하기
      </Button>
      <Button
        variant="black"
        className="h-[40px] w-full text-[14px]"
        onClick={() => {
          handleModalClose(); // 기존 모달 닫고 신고 확인 모달 오픈함
          handleCheckNotToLookOpen();
        }}
      >
        이 게시물 보지 않기
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

function OwnerModalContent({
  handleModalClose,
}: {
  handleModalClose: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3.5 px-3">
      <Button variant="primary" className="h-[40px] w-full text-[14px]">
        게시물 수정하기
      </Button>
      <Button
        variant="secondary"
        className="h-[40px] w-full text-[14px] text-cool-grayscale-500"
      >
        게시물 삭제하기
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
