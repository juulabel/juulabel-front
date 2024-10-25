"use client";
import ModalLayout from "@/_common/ModalLayout";
import Button from "@/_common/ui/Button";
import { useAuthorCheckStore } from "@/_store/tastingDetailAutorCheckStore";
import clsx from "clsx";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
          <OwnerModalContent handleModalClose={handleModalClose} />
          {/* <VisitorsModalContent
            handleModalClose={handleModalClose}
            handleCheckNotToLookOpen={handleCheckNotToLookOpen}
          /> */}
        </ModalLayout>
      )}
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
      <Button className="h-[40px] w-full rounded bg-primary-700 text-[14px] text-white">
        게시물 신고하기
      </Button>
      <Button
        className="h-[40px] w-full rounded bg-cool-grayscale-100 text-[14px] text-cool-grayscale-500"
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
  const router = useRouter();
  const params = useParams();
  const handleEditButtonClick = () => {
    const postId = params.id; // params에서 id를 가져옴
    if (postId) {
      router.push(`/share/note/${postId}/edit`);
    } else {
      toast("게시물 ID를 찾을 수 없습니다.");
    }
  };
  return (
    <div className="flex w-full flex-col gap-3.5 px-3">
      <Button
        variant="primary"
        className="h-[40px] w-full rounded text-[14px]"
        onClick={handleEditButtonClick}
      >
        게시물 수정하기
      </Button>
      <Button
        variant="secondary"
        className="h-[40px] w-full rounded text-[14px] text-cool-grayscale-500"
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
