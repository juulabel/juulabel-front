"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { GoChevronLeft } from "react-icons/go";
import { cn } from "@/_utils/commons";

interface ITopHeader {
  title: string;
  step: number;
  rest: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSubmit: () => void;
}

export default function ShareWriteTopHeader({
  title,
  step,
  rest,
  onClick,
  onSubmit,
}: ITopHeader) {
  const router = useRouter();
  const totalSteps = step + rest;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    } else {
      router.back();
    }
  };
  return (
    <div
      className={cn(
        "fixed top-0 z-50 h-16 max-h-16 w-full max-w-[560px] bg-white",
      )}
    >
      <div
        className={cn(
          "flex h-16 w-full flex-row items-center justify-center p-4",
        )}
      >
        {step != 0 && (
          <button onClick={handleClick} className="absolute left-4 p-1">
            <GoChevronLeft size={24} />
          </button>
        )}
        <div className="text-lg font-bold text-cool-grayscale-700">{title}</div>
        {step === 5 && (
          <div
            onClick={onSubmit}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer self-end font-medium text-primary-300 active:text-primary-700"
          >
            등록
          </div>
        )}
      </div>
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
    </div>
  );
}
