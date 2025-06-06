"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { cn } from "@/_utils/commons";

interface ITopHeader {
  title: string;
  step: number;
  rest: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  goBack?: () => void;
}

export default function TopHeader({
  title,
  step,
  rest,
  onClick,
  goBack,
}: ITopHeader) {
  const router = useRouter();
  const totalSteps = step + rest; // 전체 단계 수
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (goBack) {
      if (step === 1) {
        router.replace("/");
      } else if (step === 3 && onClick) {
        onClick(event);
      } else {
        goBack();
      }
    }
  };

  return (
    <div
      className={cn("fixed top-0 h-16 max-h-16 w-full max-w-[560px] bg-white")}
    >
      <div className="flex h-16 flex-row items-center justify-center p-4">
        {step != 0 && (
          <button onClick={handleClick} className="absolute left-4 p-1">
            <GoChevronLeft size={24} />
          </button>
        )}
        <div className="text-lg font-bold text-cool-grayscale-700">{title}</div>
      </div>
      {pathname !== "/" && (
        <div className="relative flex">
          <motion.div
            className="absolute z-50 h-1 bg-primary-700"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <div
            className="absolute h-1 bg-primary-300"
            style={{ width: `100%` }}
          />
        </div>
      )}
    </div>
  );
}
