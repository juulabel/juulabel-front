"use client";

import { cn } from "@/_utils/commons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { GoChevronLeft } from "react-icons/go";
import { RxDotsHorizontal } from "react-icons/rx";

interface IHeaderWithButton {
  title: string;
  buttonType: "meatballs" | "action";
  buttonName?: string;
  isActiveButton?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

export default function HeaderWithButton({
  title,
  buttonType,
  buttonName,
  isActiveButton = false,
  onClick,
}: IHeaderWithButton) {
  const router = useRouter();

  const renderButton = () => {
    switch (buttonType) {
      case "meatballs":
        return (
          <RxDotsHorizontal
            className="text-cool-grayscale-800"
            size={24}
            onClick={onClick}
          />
        );
      case "action":
        if (buttonName) {
          return (
            <div
              className={`${cn("font-medium text-primary-300", isActiveButton && "cursor-pointer text-primary-700")}`}
              onClick={onClick}
            >
              {buttonName}
            </div>
          );
        } else {
          return null;
        }

      default:
        return null;
    }
  };

  return (
    <div className="border-cool-grayscale fixed top-0 flex h-16 w-full max-w-[560px] items-center justify-between border-b bg-white p-4">
      <button onClick={() => router.back()}>
        <GoChevronLeft size={24} className="text-cool-grayscale-500" />
      </button>
      <div className="text-lg font-bold text-cool-grayscale-700">{title}</div>
      {renderButton()}
    </div>
  );
}
