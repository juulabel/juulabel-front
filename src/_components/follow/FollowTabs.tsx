import React from "react";
import { useRouter } from "next/navigation";

interface FollowTabsProps {
  userId: string;
  followingCount: number;
  followerCount: number;
  activeTab: "following" | "follower";
}

const FollowTabs: React.FC<FollowTabsProps> = ({
  userId,
  followingCount,
  followerCount,
  activeTab,
}) => {
  const router = useRouter();
  const profilePath = `/user/profile/${userId}`;

  return (
    <div className="flex flex-row">
      <div
        onClick={() => router.replace(`${profilePath}/following`)}
        className={`flex h-11 w-1/2 cursor-pointer flex-row items-center justify-center border-b-2 ${
          activeTab === "following" ? "border-black" : "border-cool-grayscale-300"
        }`}
      >
        <p className={activeTab === "following" ? "text-base text-black" : "text-cool-grayscale-600"}>
          팔로잉
        </p>
        <p className="ml-1 text-sm text-cool-grayscale-600">
          {followingCount ?? 0}
        </p>
      </div>
      <div
        onClick={() => router.replace(`${profilePath}/follower`)}
        className={`flex h-11 w-1/2 cursor-pointer flex-row items-center justify-center border-b-2 ${
          activeTab === "follower" ? "border-black" : "border-cool-grayscale-300"
        }`}
      >
        <p className={activeTab === "follower" ? "text-base text-black" : "text-cool-grayscale-600"}>
          팔로워
        </p>
        <p className="ml-1 text-sm text-cool-grayscale-600">
          {followerCount ?? 0}
        </p>
      </div>
    </div>
  );
};

export default FollowTabs; 