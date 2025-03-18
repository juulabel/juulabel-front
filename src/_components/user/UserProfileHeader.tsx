import Image from "next/image";
import { useMemo } from "react";
import { cn } from "@/_utils/commons";

interface UserProfileHeaderProps {
  profileImage: string | null;
  nickname: string;
  introduction: string | null;
  hasBadge?: boolean;
  onBadgeClick?: () => void;
  rightElement?: React.ReactNode;
}

export default function UserProfileHeader({
  profileImage,
  nickname,
  introduction,
  hasBadge = false,
  onBadgeClick,
  rightElement,
}: UserProfileHeaderProps) {
  const defaultProfileImage = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`,
    [process.env.NEXT_PUBLIC_IMAGE_BASE_PATH],
  );

  return (
    <>
      <div className="mx-[4%] flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="inline-flex h-[72px] w-[72px]">
            <Image
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full"
              src={profileImage ?? defaultProfileImage}
              alt="유저 이미지"
            />
          </div>
          <div className="ml-2 flex flex-col items-start">
            {hasBadge && (
              <div className="mb-1 justify-center text-xs font-bold leading-none text-orange-400">
                주라벨 인증 뱃지 보유
              </div>
            )}
            <div className="flex flex-row items-center">
              {hasBadge && (
                <Image
                  onClick={onBadgeClick}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
                  alt="배지"
                  className="cursor-pointer"
                  width={32}
                  height={32}
                />
              )}
              <p className="ml-2 text-lg font-bold leading-7">{nickname}</p>
            </div>
          </div>
        </div>
        {rightElement}
      </div>
      <div
        className={cn(
          "my-4 flex text-sm font-medium",
          introduction
            ? "mx-[4%] text-slate-700"
            : "items-center justify-center text-cool-grayscale-500",
        )}
      >
        {introduction ? <p>{introduction}</p> : <p>작성된 자기소개가 없어요</p>}
      </div>
    </>
  );
}
