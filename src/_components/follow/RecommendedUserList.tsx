"use client";

import FollowButton from "@/_common/FollowButton";
import {
  RecommendedUser,
  RecommendUserList,
} from "@/_types/user/recommendedUser";
import { followUser } from "@/app/api/user/followUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecommendedUserList({
  recommendedUserList,
}: RecommendUserList) {
  const router = useRouter();
  const [isFollowed, setIsFollowed] = useState<Record<number, boolean>>([]);
  useEffect(() => {
    const initialFollowState: Record<number, boolean> = {};
    recommendedUserList.forEach((user) => {
      initialFollowState[user.id] = user.isFollowed;
    });
    setIsFollowed(initialFollowState);
  }, [recommendedUserList]);
  const handleFollowButton = async (id: number) => {
    setIsFollowed((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    followUser(id.toString());
  };
  return (
    <div className="mb-8">
      {recommendedUserList.map((user: RecommendedUser, index: number) => (
        <div
          key={user.id}
          className={`flex cursor-pointer flex-row items-center justify-between transition hover:bg-cool-grayscale-100 ${
            index === 0
              ? "border-t-[1px] border-t-cool-grayscale-200"
              : "border-t-[1px] border-t-cool-grayscale-50"
          } ${
            index === recommendedUserList.length - 1
              ? "border-b-[1px] border-b-cool-grayscale-200"
              : "border-b-[1px] border-b-cool-grayscale-50"
          }`}
          onClick={(event: React.MouseEvent<HTMLDivElement>) =>
            event.stopPropagation()
          }
        >
          <div
            className="mx-[4%] my-2 flex items-center"
            onClick={() => router.push(`/user/profile/${user.id}`)}
          >
            <Image
              src={
                user.profileImage
                  ? user.profileImage
                  : `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`
              }
              width={48}
              height={48}
              alt="유저 이미지"
              className="mr-4 flex rounded-full"
            />
            <div>
              <span>{user.nickname}</span>
              {user.hasBadge && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
                  alt="배지"
                  className="mr-2"
                  width={28}
                  height={28}
                />
              )}
            </div>
          </div>
          <div className="mr-[4%]">
            <FollowButton
              width="18"
              isFollowed={isFollowed[user.id]}
              textSize="xs"
              onChangeFollow={() => handleFollowButton(user.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
