import Navigation from "@/_common/Navigation";
import FloatingBtn from "@/_components/share/FloatingBtn";
import ShareTabButton from "@/_components/share/ShareTabButton";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed top-0 z-20 w-full max-w-[560px] border-b border-cool-grayscale-300">
        <header className="flex h-16 items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-cool-grayscale-800 lg:text-3xl">
            장터
          </h1>
          <div className="flex space-x-3">
            {/* <Link href="#">
              <Image
                src="/icons/header/add-people.png"
                width="24"
            height="24"
                alt="add people"
                className="w-[24px] lg:w-[32px]"
              />
            </Link> */}
            <Link href="/notification" className="relative">
              <Image
                src="/icons/header/notification.png"
                width="24"
                height="24"
                alt="notification"
                className="w-[24px] lg:w-[32px]"
              />
              <div className="absolute -right-0.5 -top-0.5 rounded-[8px] bg-primary-700 px-1 py-[1px] text-center text-[9px] font-medium text-white">
                24
              </div>
            </Link>
          </div>
        </header>
      </div>
      <div className="h-full overflow-y-auto scrollbar-hide">{children}</div>
      <FloatingBtn />
      <Navigation />
    </>
  );
}
