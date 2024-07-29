"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";

interface IFollowHeader {
  title: string;
}

export default function FollowHeader({ title }: IFollowHeader) {
  const router = useRouter();
  return (
    <div>
      <div className="flex h-16 flex-row items-center justify-between">
        <div>
          <button onClick={() => router.back()}>
            <GoChevronLeft size={24} />
          </button>
        </div>
        <div className="text-lg font-bold">{title}</div>
        <button>
          <img
            src="/svg/search_icon.svg"
            alt="Search Icon"
            onClick={() => router.push("/user/search")}
          />
        </button>
      </div>
    </div>
  );
}
