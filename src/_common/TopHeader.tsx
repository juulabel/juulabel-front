"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";

interface ITopHeader {
  title: string;
  step: number;
  rest: number;
  onClick?: (event: React.MouseEvent<SVGElement>) => void;
}

type widthType = Record<number, string>;

export default function TopHeader({ title, step, rest, onClick }: ITopHeader) {
  const router = useRouter();
  const width: widthType = {
    1: "w-1/3",
    2: "w-2/3",
    3: "w-full",
  };
  const handleClick = (event: React.MouseEvent<SVGElement>) => {
    if (onClick) {
      event.preventDefault();
      onClick(event);
    }
  };
  return (
    <div>
      <div className="mx-7 flex h-16 flex-row items-center justify-between">
        <div>
          <button onClick={() => router.back()}>
            <GoChevronLeft
              size={24}
              onClick={(event: React.MouseEvent<SVGElement>) =>
                handleClick(event)
              }
            />
          </button>
        </div>
        <div className="text-lg font-bold">{title}</div>
        <div></div>
      </div>
      <div className="flex">
        <div className={`${width[step]} h-1 bg-primary-700`} />
        <div className={`${width[rest]} h-1 bg-primary-300`} />
      </div>
    </div>
  );
}
