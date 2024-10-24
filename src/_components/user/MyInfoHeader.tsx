"use client";

import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";

interface IUserHeader {
  title: string;
}
export default function MyInfoHeader({ title }: IUserHeader) {
  const router = useRouter();

  return (
    <div>
      <div className="mb-4 flex h-16 flex-row items-center justify-between">
        <div>
          <button onClick={() => router.back()}>
            <GoChevronLeft size={24} />
          </button>
        </div>
        <div className="text-lg font-bold">{title}</div>
        <br />
      </div>
    </div>
  );
}
