"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/_utils/commons";

export default function ShareTabButton() {
  const pathname = usePathname();

  return (
    <div className="flex h-11">
      <Link
        href="note"
        className={cn(
          "flex w-1/2 items-center justify-center border-b border-cool-grayscale-300 px-2 py-2.5 font-medium text-cool-grayscale-500",
          pathname === "/share/note" && "border-b-2 border-black text-black",
        )}
      >
        전통주 시음노트
      </Link>
      <Link
        href="life"
        className={cn(
          "flex w-1/2 items-center justify-center border-b border-cool-grayscale-300 px-2 py-2.5 font-medium text-cool-grayscale-500",
          pathname === "/share/life" && "border-b-2 border-black text-black",
        )}
      >
        전통주 일상생활
      </Link>
    </div>
  );
}
