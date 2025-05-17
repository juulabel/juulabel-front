"use client";

import Image from "next/image";
import ShopLayout from "@/_components/shop/ShopLayout";

export default function Notes() {
  return (
    <ShopLayout>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Image
          className="pb-[16px]"
          width="95"
          height="88"
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/temp_shop_logo.png`}
          alt="장터 임시 페이지 아이콘"
        />
        <div className="font-['Pretendard'] text-base font-medium leading-normal text-slate-800">
          장터는 준비중에 있어요.
          <br />
          빠른시일 내에 찾아뵐게요!
        </div>
      </div>
    </ShopLayout>
  );
}
