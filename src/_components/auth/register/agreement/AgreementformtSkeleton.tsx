"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AgreementFormSkeleton() {
  return (
    <div className="w-full max-w-[560px] mx-auto">
      <div className="mx-[4%] my-4">
        <Skeleton height={24} width={200} />
        <Skeleton height={20} width={150} className="mt-2" />
      </div>

      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="mx-[4%] my-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={20} width={180} />
          </div>
          <Skeleton height={20} width={24} />
        </div>
      ))}

      <div className="mx-[4%] mt-8">
        <Skeleton height={48} width="100%" borderRadius={8} />
      </div>
    </div>
  );
}
