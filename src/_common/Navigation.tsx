"use client";

import Link from "next/link";
import ShareSvg from "@/icons/navigation/share.svg";
import ShareActSvg from "@/icons/navigation/share-active.svg";
import SearchSvg from "@/icons/navigation/search.svg";
import SearchActSvg from "@/icons/navigation/search-active.svg";
import LabelCameraSvg from "@/icons/navigation/label-camera.svg";
import ShopSvg from "@/icons/navigation/shop.svg";
import ShopActSvg from "@/icons/navigation/shop-active.svg";
import MypageSvg from "@/icons/navigation/mypage.svg";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/_utils/commons";
import ModalWithoutCancel from "./ModalWithoutCancel";

export default function Navigation({
  handleSearchClick,
}: {
  handleSearchClick?: () => void;
}) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      <footer className="fixed bottom-0 z-10 flex h-[66px] w-full max-w-[560px] items-center justify-between space-x-2 border-t border-cool-grayscale-200 bg-white px-4 py-2">
        <Link
          href="/share/note"
          className={cn(
            "flex w-1/5 flex-col items-center justify-center text-cool-grayscale-500",
            pathname.startsWith("/share") && "text-cool-grayscale-800",
          )}
        >
          {pathname.startsWith("/share") ? (
            <ShareActSvg className="mb-1 w-[32px] fill-cool-grayscale-800" />
          ) : (
            <ShareSvg className="mb-1 w-[32px] fill-cool-grayscale-500" />
          )}
          <div className="hidden text-xs min-[350px]:block">공유공간</div>
        </Link>
        <Link
          href="/search"
          onClick={handleSearchClick}
          className={cn(
            "flex w-1/5 flex-col items-center justify-center text-cool-grayscale-500",
            pathname.startsWith("/search") && "text-cool-grayscale-800",
          )}
        >
          {pathname.startsWith("/search") ? (
            <SearchActSvg className="mb-1 w-[32px] fill-cool-grayscale-800" />
          ) : (
            <SearchSvg className="mb-1 w-[32px] fill-cool-grayscale-500" />
          )}
          <div className="hidden text-xs min-[350px]:block">전통주 검색</div>
        </Link>

        <Link
          onClick={() => setModalOpen(true)}
          href="#"
          className="flex w-1/5 justify-center"
        >
          <div className="flex h-full items-center justify-center rounded-full bg-cool-grayscale-800 p-2.5">
            <LabelCameraSvg className="w-[32px] fill-white" />
          </div>
        </Link>

        <Link
          href="/shop"
          className={cn(
            "flex w-1/5 flex-col items-center justify-center text-cool-grayscale-500",
            pathname.startsWith("/shop") && "text-cool-grayscale-800",
          )}
        >
          {pathname.startsWith("/shop") ? (
            <ShopActSvg className="mb-1 w-[32px] fill-cool-grayscale-800" />
          ) : (
            <ShopSvg className="mb-1 w-[32px] fill-cool-grayscale-500" />
          )}

          <div className="hidden text-xs min-[350px]:block">장터</div>
        </Link>
        <Link
          href="/user/my-space"
          className={cn(
            "flex w-1/5 flex-col items-center justify-center text-cool-grayscale-500",
            pathname.startsWith("/user/my-space") && "text-cool-grayscale-800",
          )}
        >
          {pathname.startsWith("/user/my-space") ? (
            <MypageSvg className="mb-1 w-[32px] fill-cool-grayscale-800" />
          ) : (
            <MypageSvg className="mb-1 w-[32px] fill-cool-grayscale-500" />
          )}

          <div className="hidden text-xs min-[350px]:block">내 공간</div>
        </Link>
      </footer>
      {modalOpen && (
        <ModalWithoutCancel
          modalTitle={
            "라벨 스캔 기능은 현재 준비중이에요. \n 빠른 시일 내에 찾아뵐게요."
          }
          primaryBtnText={"닫기"}
          handlePrimaryBtn={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}
