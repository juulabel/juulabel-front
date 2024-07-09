import Link from "next/link";
import { GoChevronLeft } from "react-icons/go";

interface TopHeaderProps {
  backUrl: string;
  title: string;
  step: number;
  rest: number;
}

type widthType = Record<number, string>;

export default function TopHeader(props: TopHeaderProps) {
  const width: widthType = {
    1: "w-1/3",
    2: "w-2/3",
    3: "w-full",
  };

  return (
    <div>
      <div className="flex h-16 flex-row items-center justify-between">
        <div>
          <Link href={props.backUrl}>
            <GoChevronLeft size={24} />
          </Link>
        </div>
        <div className="font-bold text-lg">{props.title}</div>
        <div></div>
      </div>
      <div className="flex">
        <div className={`${width[props.step]} h-1 bg-active`} />
        <div className={`${width[props.rest]} h-1 bg-progress-bar-inactive`} />
      </div>
    </div>
  );
}
