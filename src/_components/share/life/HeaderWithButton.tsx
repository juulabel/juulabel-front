"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { RxDotsHorizontal } from "react-icons/rx";
import { cn } from "@/_utils/commons";

interface IHeaderWithButton {
  title: string;
  titleLink?: string;
  buttonType: "meatballs" | "newpost" | "notification" | "";
  buttonName?: string;
  isActiveButton?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

export default function HeaderWithButton({
  title,
  titleLink,
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
            className="cursor-pointer text-cool-grayscale-800"
            size={24}
            onClick={onClick}
          />
        );

      case "newpost":
        return (
          <div
            className={`${cn("font-medium text-primary-300", isActiveButton && "cursor-pointer text-primary-700")}`}
            onClick={onClick}
          >
            {buttonName}
          </div>
        );
      case "notification":
        return (
          <div
            className={`${cn("cursor-pointer font-medium text-cool-grayscale-500")}`}
            onClick={onClick}
          >
            {buttonName}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border-cool-grayscale relative flex h-16 w-full max-w-[560px] items-center border-b p-4">
      <button onClick={() => router.back()} className="absolute left-4">
        <GoChevronLeft size={24} className="text-cool-grayscale-500" />
      </button>
      {titleLink ? (
        <Link
          href={titleLink}
          className="mx-auto text-center text-lg font-bold text-cool-grayscale-700"
        >
          {title}
        </Link>
      ) : (
        <div className="mx-auto text-center text-lg font-bold text-cool-grayscale-700">
          {title}
        </div>
      )}
      <div className="absolute right-4">{renderButton()}</div>
    </div>
  );
}
