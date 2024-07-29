import Link from "next/link";
import React from "react";

interface IBottomButton {
  url?: string;
  enableButton: boolean | undefined;
  children: React.ReactNode;
  onClick: () => void;
}

export default function BottomButton({
  url,
  enableButton,
  children,
  onClick,
}: IBottomButton) {
  return (
    <>
      {url ? (
        <Link
          className={`absolute bottom-[4%] mx-[4%] mt-8 flex w-[91%] max-w-[560px] items-center justify-center rounded-[10px] py-[14px] text-center text-base font-bold text-white ${
            enableButton
              ? "bg-primary-700"
              : "pointer-events-none bg-primary-300"
          }`}
          href={url}
          onClick={onClick}
        >
          {children}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`relative bottom-[4%] mx-[4%] my-[4%] flex w-[91%] max-w-[560px] items-center justify-center rounded-[10px] py-[14px] text-base font-bold text-white ${
            enableButton
              ? "bg-primary-700"
              : "pointer-events-none bg-primary-300"
          }`}
        >
          {children}
        </button>
      )}
    </>
  );
}
