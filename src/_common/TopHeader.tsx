"use client";

import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";

interface ITopHeader {
  title: string;
  step: number;
  rest: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function TopHeader({ title, step, rest, onClick }: ITopHeader) {
  const router = useRouter();
  const totalSteps = step + rest; // 전체 단계 수

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      event.preventDefault();
      onClick(event);
    } else {
      step == 1 ? router.replace("/") : router.back(); // onClick이 없을 때만 router.back() 호출
    }
  };

  return (
    <div>
      <div className="relative flex h-16 flex-row items-center justify-center p-4">
        <button onClick={handleClick} className="absolute left-4 p-1">
          <GoChevronLeft size={24} />
        </button>
        <div className="text-lg font-bold text-cool-grayscale-700">{title}</div>
      </div>
      <div className="flex">
        <div
          className="h-1 bg-primary-700"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
        <div
          className="h-1 bg-primary-300"
          style={{ width: `${(rest / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
