import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // 기본 스타일 추가

export default function SkeletonUI() {
  return (
    <div className="flex h-full w-full flex-col gap-3 px-5 pt-[68px]">
      <div className="flex w-full justify-between">
        <Skeleton width={170} height={28} borderRadius={8} duration={0.8} />
        <Skeleton width={101} height={28} borderRadius={8} duration={0.8} />
      </div>

      <Skeleton height={482} borderRadius={8} duration={0.8} className="mb-6" />

      <div className="flex flex-col gap-1">
        <Skeleton height={59} borderRadius={8} duration={0.8} />
        <Skeleton height={24} width={118} borderRadius={8} duration={0.8} />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_1fr_2fr] gap-8">
        <Skeleton height={45} borderRadius={8} duration={0.8} />
        <Skeleton height={45} borderRadius={8} duration={0.8} />
        <Skeleton height={45} borderRadius={8} duration={0.8} />
      </div>
    </div>
  );
}
