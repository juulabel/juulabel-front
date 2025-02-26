"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFollowee } from "@/app/api/user/getFollowee";
import UserHeader from "@/_components/user/UserHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserProfile } from "@/app/api/user/getUserProfile";

export default function FollowingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["following", params.id],
    queryFn: ({ pageParam }) =>
      getFollowee(params.id as string, pageParam.lastFolloweeId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastFolloweeId: 0 },
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserProfile(params.id),
  });

  const pathname = usePathname();

  const [contentState, setContentState] = useState({
    isFollowingClicked: true,
    isFollowerClicked: false,
  });

  return (
    <div className="h-full w-full max-w-[560px]">
      <UserHeader
        title={`${user?.nickname ?? "팔로잉"}`}
        handleBackButton={() => router.back()}
        bottomBorder={false}
      />

      <div className="flex flex-row">
        <Link
          href={`${pathname}/following`}
          className={`flex h-11 flex-row items-center justify-center border-b-2 ${contentState.isFollowingClicked ? "border-black" : "border-cool-grayscale-300"} w-1/2`}
        >
          <p
            className={`${contentState.isFollowingClicked ? "text-base text-black" : "text-cool-grayscale-600"}`}
          >
            팔로잉
          </p>
          <p className="ml-1 text-sm text-cool-grayscale-600">0</p>
        </Link>
        <Link
          href={`${pathname}/followers`}
          className={`flex h-11 flex-row items-center justify-center border-b-2 ${contentState.isFollowerClicked ? "border-black" : "border-cool-grayscale-300"} w-1/2`}
        >
          <p
            className={`${contentState.isFollowerClicked ? "text-base text-black" : "text-cool-grayscale-600"}`}
          >
            팔로워
          </p>
          <p className="ml-1 text-sm text-cool-grayscale-600">0</p>
        </Link>
      </div>
    </div>
  );
}
