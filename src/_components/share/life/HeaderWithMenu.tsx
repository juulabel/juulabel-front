"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { GoChevronLeft } from "react-icons/go";
import { RxDotsHorizontal } from "react-icons/rx";

interface IHeaderWithMenu {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function HeaderWithMenu({ title, onClick }: IHeaderWithMenu) {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      event.preventDefault();
      onClick(event);
    } else {
      router.back(); // onClick이 없을 때만 router.back() 호출
    }
  };

  return (
    <div className="flex h-16 w-full items-center justify-between p-4">
      <button onClick={handleClick}>
        <GoChevronLeft size={24} className="text-cool-grayscale-500" />
      </button>
      <div className="text-lg font-bold text-cool-grayscale-700">{title}</div>
      <RxDotsHorizontal className="text-cool-grayscale-800" size={24} />
    </div>
  );
}
