"use client";

import ModalLayout from "@/_common/ModalLayout";
import { cn } from "@/_utils/commons";
import { GoChevronLeft } from "react-icons/go";
import UserReport from "./UserReport";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useAuthorCheckStore } from "@/_store/tastingDetailStore";

interface IUserHeader {
  title: string;
  handleBackButton: () => void;
  bottomBorder: boolean;
  isMarginBottom?: boolean;
  memberId?: string;
}
export default function UserHeader({
  title,
  handleBackButton,
  bottomBorder,
  isMarginBottom = true,
  memberId,
}: IUserHeader) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const { isAuthor } = useAuthorCheckStore();
  return (
    <div>
      <div
        className={cn(
          "mx-[4%] flex h-16 flex-row items-center justify-between",
          bottomBorder && "border-b border-gray-300",
          isMarginBottom && "mb-4",
        )}
      >
        <div>
          <button onClick={handleBackButton}>
            <GoChevronLeft size={24} />
          </button>
        </div>
        <div className="text-lg font-bold">{title}</div>
        <div>
          {!isAuthor && (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/three_dots_horizontal.svg`}
              width={28}
              height={28}
              alt="three dots"
              className={clsx("animate-fadeIn cursor-pointer")}
              onClick={handleModalOpen}
            />
          )}
        </div>

        {modalOpen && (
          <ModalLayout onClose={handleModalClose}>
            <UserReport
              handleModalClose={handleModalClose}
              memberId={memberId}
            />
          </ModalLayout>
        )}
      </div>
    </div>
  );
}
