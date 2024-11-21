import { useFetchNotificationCount } from "@/app/api/notification/useNotifications";
import Image from "next/image";
import Link from "next/link";

export default function SearchHeader() {
  const { data: notificationCount = 0, isLoading } =
    useFetchNotificationCount();
  const displayCount = notificationCount > 99 ? "99+" : notificationCount;

  return (
    <div className="w-full max-w-[560px]">
      <header className="flex h-16 items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-cool-grayscale-700 lg:text-3xl">
          전통주 검색
        </h1>
        <div className="flex space-x-3">
          <Link href="/notification" className="relative">
            <Image
              src="/images/icons/header/notification.png"
              width="32"
              height="32"
              alt="notification"
              className="w-[28px] lg:w-[28px]"
            />
            {notificationCount > 0 && (
              <div className="absolute -right-0.5 -top-0.5 rounded-[8px] bg-primary-700 px-1 py-[1px] text-center text-[9px] font-medium text-white">
                {displayCount}
              </div>
            )}
          </Link>
        </div>
      </header>
    </div>
  );
}
