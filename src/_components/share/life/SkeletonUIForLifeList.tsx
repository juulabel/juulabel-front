import React from "react";

interface LifeListSkeletonListProps {
  count?: number;
}

export default function LifeListSkeletonList({
  count = 6,
}: LifeListSkeletonListProps) {
  return (
    <ul className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <LifeListSkeleton />
        </li>
      ))}
    </ul>
  );
}

function LifeListSkeleton() {
  return (
    <div className="animate-pulse px-4 pt-5">
      {/* Upper section with title, content, and thumbnail */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="mb-1 h-4 w-1/2 rounded bg-gray-300" />
          {/* Content skeleton (two lines) */}
          <div className="mb-2 h-3 w-full rounded bg-gray-300" />
          <div className="h-3 w-5/6 rounded bg-gray-300" />
        </div>

        {/* Thumbnail skeleton */}
        <div className="relative ml-4 h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg bg-gray-300">
          {/* Optional overlay for image count placeholder */}
          <div className="absolute left-0 top-0 z-10 bg-black bg-opacity-60 px-2 py-0.5 text-sm text-white">
            <span className="invisible">#</span>
          </div>
        </div>
      </div>

      {/* Lower section with profile info and interaction counts */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          {/* Profile image skeleton */}
          <div className="h-6 w-6 rounded-full bg-gray-300" />
          {/* User details (nickname & date) skeleton */}
          <div className="h-3 w-16 rounded-full bg-gray-300" />
          <div className="h-3 w-1 rounded-full bg-gray-300" />
          <div className="h-3 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Like and comment counts skeleton */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
            <div className="h-3 w-4 rounded bg-gray-300" />
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
            <div className="h-3 w-4 rounded bg-gray-300" />
          </div>
        </div>
      </div>
      <hr className="mt-5 bg-gray-200" />
    </div>
  );
}
