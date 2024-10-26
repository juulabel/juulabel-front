"use client";

import Link from "next/link";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import UserHeaderModal from "./UserHeaderModal";
import ConfirmModal from "@/_common/ConfirmModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IMySpaceHeader {
  title: string;
}

export default function MySpaceHeader({ title }: IMySpaceHeader) {
  return (
    <div>
      <div className="mx-[4%] mb-4 flex h-16 flex-row items-center justify-between border-b-[1px] border-cool-grayscale-300">
        <div className="text-2xl font-bold">{title}</div>
        <div className="flex space-x-3">
          <Link href="/notification" className="relative">
            <Image
              src="/images/icons/header/notification.png"
              width="32"
              height="32"
              alt="notification"
              className="w-[28px] lg:w-[28px]"
            />
            <div className="absolute -right-0.5 -top-0.5 rounded-[8px] bg-primary-700 px-1 py-[1px] text-center text-[9px] font-medium text-white">
              24
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
