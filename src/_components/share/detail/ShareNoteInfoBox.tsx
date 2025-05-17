"use client";

import { useRouter } from "next/navigation";
import { IAlchoholicDrinksInfo, ITastingNoteDetailInfo } from "@/_types";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
  alcoholicDrinksInfo: IAlchoholicDrinksInfo | undefined;
}

export default function ShareNoteInfoBox({ info, alcoholicDrinksInfo }: Props) {
  const router = useRouter();

  if (!info || !alcoholicDrinksInfo) {
    return <div></div>;
  }

  // 102px 132px
  return (
    <section className="mt-4 flex h-[132px] flex-col gap-4 px-3">
      <div className="text-[24px] font-bold"> {info.alcoholicDrinksName}</div>

      {alcoholicDrinksInfo.isOfficialData && (
        <div
          className="cursor-pointer text-[16px] font-semibold text-primary-800"
          onClick={() => {
            router.push(
              `/share/liquor/${alcoholicDrinksInfo.alcoholicDrinksId}`,
            );
          }}
        >
          술 정보 보러가기 {">"}
        </div>
      )}

      <div className="grid w-full grid-cols-4">
        <div className="flex flex-col">
          <span className="text-cool-grayscale-500">주종</span>
          <span className="font-bold text-cool-grayscale-800">
            {info.alcoholTypeName}
          </span>
        </div>

        <div className="flex flex-col text-cool-grayscale-500">
          <span className="text-cool-grayscale-500">도수</span>
          <span className="font-bold text-cool-grayscale-800">
            {info.alcoholContent} %
          </span>
        </div>

        <div className="col-span-2 flex flex-col text-cool-grayscale-500">
          <span className="text-cool-grayscale-500">양조장</span>
          <span className="font-bold text-cool-grayscale-800">
            {info.breweryName}
          </span>
        </div>
      </div>
    </section>
  );
}
