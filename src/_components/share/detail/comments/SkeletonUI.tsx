"use client";

import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// 기본 스타일 추가

export default function SkeletonUI() {
  //   useEffect(() => {
  //     document.body.style.overflow = "hidden";

  //     return () => {
  //       document.body.style.overflow = "auto";
  //     };
  //   });

  return (
    <div className="flex w-full flex-col gap-2 py-2 pt-[64px]">
      <div className="flex w-full flex-col gap-1 border-b-[1px] border-cool-grayscale-200 px-1 py-2">
        <Skeleton width={104} height={24} borderRadius={8} duration={0.8} />

        <Skeleton height={53} borderRadius={8} duration={0.8} />
        <div className="flex justify-end">
          <Skeleton width={65} height={22} borderRadius={8} duration={0.8} />
        </div>
      </div>
      <div className="flex flex-col gap-1 border-b-[1px] border-cool-grayscale-200 px-1 py-2">
        <Skeleton width={104} height={24} borderRadius={8} duration={0.8} />

        <Skeleton height={53} borderRadius={8} duration={0.8} />
        <div className="flex justify-end">
          <Skeleton width={65} height={22} borderRadius={8} duration={0.8} />
        </div>
      </div>
      <div className="flex flex-col gap-1 border-b-[1px] border-cool-grayscale-200 px-1 py-2">
        <Skeleton width={104} height={24} borderRadius={8} duration={0.8} />

        <Skeleton height={53} borderRadius={8} duration={0.8} />
        <div className="flex justify-end">
          <Skeleton width={65} height={22} borderRadius={8} duration={0.8} />
        </div>
      </div>
      <div className="flex flex-col gap-1 border-b-[1px] border-cool-grayscale-200 px-1 py-2">
        <Skeleton width={104} height={24} borderRadius={8} duration={0.8} />

        <Skeleton height={53} borderRadius={8} duration={0.8} />
        <div className="flex justify-end">
          <Skeleton width={65} height={22} borderRadius={8} duration={0.8} />
        </div>
      </div>
      <div className="flex flex-col gap-1 border-b-[1px] border-cool-grayscale-200 px-1 py-2">
        <Skeleton width={104} height={24} borderRadius={8} duration={0.8} />

        <Skeleton height={53} borderRadius={8} duration={0.8} />
        <div className="flex justify-end">
          <Skeleton width={65} height={22} borderRadius={8} duration={0.8} />
        </div>
      </div>
    </div>
  );
}
