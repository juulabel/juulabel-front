import Link from "next/link";
import { ReactNode } from "react";

interface UserProfileStatsProps {
  memberId: string;
  followingCount: number;
  followerCount: number;
  totalPosts: number;
  isClickable?: boolean;
}

interface StatsElementProps {
  label: string;
  count: number;
  className?: string;
}

export default function UserProfileStats({
  memberId,
  followingCount = 0,
  followerCount = 0,
  totalPosts = 0,
  isClickable = true,
}: UserProfileStatsProps) {
  const StatsElement = ({
    label,
    count,
    className,
  }: StatsElementProps): ReactNode => (
    <div
      className={`flex flex-col items-center justify-center ${className || ""}`}
    >
      <p className="text-sm font-normal text-cool-grayscale-500">{label}</p>
      <p className="text-base font-bold text-cool-grayscale-800">{count}</p>
    </div>
  );

  return (
    <div className="mx-[12%] mb-4 mt-6 flex flex-row items-center justify-between">
      {isClickable ? (
        <Link
          href={`/user/follow/${memberId}?type=following`}
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <p className="text-sm font-normal text-cool-grayscale-500">팔로잉</p>
          <p className="text-base font-bold text-cool-grayscale-800">
            {followingCount}
          </p>
        </Link>
      ) : (
        <StatsElement label="팔로잉" count={followingCount} />
      )}

      <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

      {isClickable ? (
        <Link
          href={`/user/follow/${memberId}?type=follower`}
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <p className="text-sm font-normal text-cool-grayscale-500">팔로워</p>
          <p className="text-base font-bold text-cool-grayscale-800">
            {followerCount}
          </p>
        </Link>
      ) : (
        <StatsElement label="팔로워" count={followerCount} />
      )}

      <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200" />

      <StatsElement label="총 게시글" count={totalPosts} />
    </div>
  );
}
