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
    <div className="fixed bottom-[4%] left-1/2 flex w-full max-w-[560px] -translate-x-1/2 transform justify-center">
      {url ? (
        <Link
          className={`flex w-[91%] max-w-[560px] items-center justify-center rounded-[10px] py-[14px] text-center text-base font-bold text-white ${
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
          className={`flex w-[91%] max-w-[560px] items-center justify-center rounded-[10px] py-[14px] text-base font-bold text-white ${
            enableButton
              ? "bg-primary-700"
              : "pointer-events-none bg-primary-300"
          }`}
        >
          {children}
        </button>
      )}
    </div>
  );
}
