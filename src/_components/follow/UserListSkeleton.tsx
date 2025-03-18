import React from "react";

interface UserListSkeletonProps {
  count: number;
}

const UserListSkeleton: React.FC<UserListSkeletonProps> = ({ count }) => {
  return (
    <ul className="list-none space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="flex cursor-pointer flex-row items-center justify-between border-b border-t border-b-cool-grayscale-50 border-t-cool-grayscale-50 py-2 transition hover:bg-cool-grayscale-100 rounded-lg shadow-md"
        >
          <div className="mx-[4%] my-2 flex items-center">
            <div className="h-[40px] w-[40px] animate-pulse rounded-full bg-cool-grayscale-200"></div>
            <div className="ml-2 flex flex-col">
              <div className="h-4 w-32 animate-pulse rounded bg-cool-grayscale-200"></div>
              <div className="h-3 w-24 animate-pulse rounded bg-cool-grayscale-200 mt-1"></div>
            </div>
          </div>
          <div className="mr-[4%] flex flex-row whitespace-nowrap">
            <div className="h-6 w-20 animate-pulse rounded bg-cool-grayscale-200"></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserListSkeleton;
