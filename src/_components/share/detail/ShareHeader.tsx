"use client";

import clsx from "clsx";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import OwnerModalContent from "@/_components/report/OwnerModalContent";
import VisitorsModalContent from "@/_components/report/VisitorsModalContent";
import ModalLayout from "@/_common/ModalLayout";
import { useAuthorCheckStore } from "@/_store/tastingDetailStore";

// import { toast } from "react-toastify";

export default function ShareHeader() {
  const router = useRouter();
  const params = useParams();
  const tastingNoteId = params.id; // params에서 id를 가져옴
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // const [checkNotToLook, setCheckNotToLook] = useState<boolean>(false);
  const pathname = usePathname();

  const { isAuthor } = useAuthorCheckStore();

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  // const handleCheckNotToLookOpen = () => {
  //   setCheckNotToLook(true);
  // };

  // const handleCheckNotToLookClose = () => {
  //   setCheckNotToLook(false);
  // };

  // const handleDontLookAtThePost = () => {
  //   toast("앞으로 해당 게시물이 보이지 않습니다.");
  //   router.push("/share/note");
  // };

  if (pathname.endsWith("/comments")) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 z-10 flex h-[64px] w-full max-w-[560px] items-center justify-between border-b border-gray-300 bg-white px-3">
        <div
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/left_arrow.svg`}
            width={32}
            height={32}
            alt="left"
          />
        </div>
        <div className="text-[18px] font-semibold text-[#334155]">
          전통주 시음노트
        </div>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/three_dots_horizontal.svg`}
            width={28}
            height={28}
            alt="three dots"
            className={clsx("animate-fadeIn cursor-pointer")}
            onClick={handleModalOpen}
          />
        </div>
      </div>
      {modalOpen && (
        <ModalLayout onClose={handleModalClose}>
          {isAuthor ? (
            <OwnerModalContent
              postId={tastingNoteId as string}
              handleModalClose={handleModalClose}
            />
          ) : (
            <VisitorsModalContent
              targetId={tastingNoteId as string}
              type="시음노트"
              text="게시글"
              handleModalClose={handleModalClose}
            />
          )}
        </ModalLayout>
      )}
    </>
  );
}
