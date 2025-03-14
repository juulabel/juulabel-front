"use client";

import { useFetchNotificationCount } from "@/app/api/notification/useNotifications";
import Image from "next/image";
import Link from "next/link";

interface IMySpaceHeader {
  title: string;
}

export default function MySpaceHeader({ title }: IMySpaceHeader) {
  const { data: notificationCount = 0, isLoading } =
    useFetchNotificationCount();
  const displayCount = notificationCount > 99 ? "99+" : notificationCount;
  return (
    <div>
      <div className="mx-[4%] mb-4 flex h-16 flex-row items-center justify-between border-b-[1px] border-cool-grayscale-300">
        <div className="text-2xl font-bold">{title}</div>
        <div className="flex space-x-3">
          <Link href="/notification" className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/header/notification.png`}
              width="24"
              height="24"
              alt="notification"
              className="w-[24px] lg:w-[32px]"
            />
            {notificationCount > 0 && (
              <div className="absolute -right-0.5 -top-0.5 rounded-[8px] bg-primary-700 px-1 py-[1px] text-center text-[9px] font-medium text-white">
                {displayCount}
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
