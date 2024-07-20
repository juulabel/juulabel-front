"use client";

import Link from "next/link";
import { GoChevronLeft } from "react-icons/go";

interface TopHeaderProps {
  backUrl: string;
  title: string;
  step: number;
  rest: number;
  onClick?: (event: React.MouseEvent<SVGElement>) => void;
}

type widthType = Record<number, string>;

export default function TopHeader(props: TopHeaderProps) {
  const width: widthType = {
    1: "w-1/3",
    2: "w-2/3",
    3: "w-full",
  };
  const handleClick = (event: React.MouseEvent<SVGElement>) => {
    if (props.onClick) {
      event.preventDefault();
      props.onClick(event);
    }
  };
  return (
    <div>
      <div className="flex h-16 flex-row items-center justify-between">
        <div>
          <Link href={props.backUrl}>
            <GoChevronLeft
              size={24}
              onClick={(event: React.MouseEvent<SVGElement>) =>
                handleClick(event)
              }
            />
          </Link>
        </div>
        <div className="text-lg font-bold">{props.title}</div>
        <div></div>
      </div>
      <div className="flex">
        <div className={`${width[props.step]} h-1 bg-primary-700`} />
        <div className={`${width[props.rest]} h-1 bg-primary-300`} />
      </div>
    </div>
  );
}
