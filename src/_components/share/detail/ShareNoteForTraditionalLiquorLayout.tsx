import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import FilterDropdown from "@/_components/share/detail/FilterDropdown";
import clsx from "clsx";
import ShareNoteForTraditionalLiquorFilter from "@/_components/share/detail/ShareNoteForTraditionalLiquorFilter";

interface Props {
  children: ReactNode;
  id: number;
}

export default function ShareNoteForTraditionalLiquorLayout({
  children,
  id,
}: Props) {
  return (
    <section
      className={
        "relative h-screen w-full max-w-[560px] overflow-y-auto overflow-x-hidden scrollbar-hide"
      }
      id={"layout-liquor"}
    >
      <header className="fixed top-0 z-50 flex h-[64px] w-full max-w-[560px] items-center justify-between border-b border-gray-300 bg-white px-3">
        <Link href={`/share/liquor/${id}`} className="cursor-pointer">
          <Image
            src={"/svg/left_arrow.svg"}
            width={32}
            height={32}
            alt="left"
          />
        </Link>
        <div className="text-[18px] font-semibold text-[#334155]">
          시음노트 모아보기
        </div>

        <div></div>
      </header>

      <section className={"h-[64px]"} />

      <section className="flex h-[71px] w-full flex-row items-center justify-between px-[16px]">
        <div className={"text-[18px] leading-[27px]"}>
          <span className="t font-bold">탁 100 네추럴</span>의 시음노트
          <div className={"text-[16px] leading-[24px] text-cool-grayscale-500"}>
            <span className={"font-bold text-primary-700"}> 10건</span>의
            시음노트가 있어요.
          </div>
        </div>

        <ShareNoteForTraditionalLiquorFilter />
      </section>
      <section className={"w-full p-[16px]"}>{children}</section>
    </section>
  );
}
