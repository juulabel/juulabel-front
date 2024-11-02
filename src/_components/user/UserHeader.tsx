"use client";

import { cn } from "@/_utils/commons";
import { GoChevronLeft } from "react-icons/go";

interface IUserHeader {
  title: string;
  handleBackButton: () => void;
  bottomBorder: boolean;
}
export default function UserHeader({
  title,
  handleBackButton,
  bottomBorder,
}: IUserHeader) {
  return (
    <div>
      <div
        className={cn(
          "mx-[4%] mb-4 flex h-16 flex-row items-center justify-between",
          bottomBorder && "border-b border-gray-300",
        )}
      >
        <div>
          <button onClick={handleBackButton}>
            <GoChevronLeft size={24} />
          </button>
        </div>
        <div className="text-lg font-bold">{title}</div>
        <br />
      </div>
    </div>
  );
}
