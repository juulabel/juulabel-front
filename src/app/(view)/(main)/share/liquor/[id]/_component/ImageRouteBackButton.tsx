"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ImageRouteBackButton() {
  const router = useRouter();

  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/left_arrow_white.svg`}
      width={28}
      height={28}
      alt="<"
      className="absolute left-5 top-1/3 z-10 -translate-y-1/2 cursor-pointer"
      onClick={() => {
        router.back();
      }}
    />
  );
}
