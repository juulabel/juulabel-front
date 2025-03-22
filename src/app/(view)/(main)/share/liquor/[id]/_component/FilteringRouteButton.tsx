"use client";

import { useRouter } from "next/navigation";

interface Props {
  id: number;
}

export default function FilteringRouteButton({ id }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(`/share/liquor/${id}/filter`);
      }}
      className="my-4 h-[37px] w-full rounded-[4px] border-[1px] border-cool-grayscale-300 bg-white text-[14px] text-cool-grayscale-800"
    >
      모든 시음노트 보기
    </button>
  );
}
