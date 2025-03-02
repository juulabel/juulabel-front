import Image from "next/image";
import { useRef, useEffect } from "react";

export default function BadgeInfoModal({
  setIsBadgeInfoModalOpen,
}: {
  setIsBadgeInfoModalOpen: (isBadgeInfoModalOpen: boolean) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsBadgeInfoModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsBadgeInfoModalOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="inline-flex h-[414px] w-[314px] flex-col items-center justify-start gap-3.5 rounded-2xl bg-white p-4"
      >
        <div className="self-stretch text-center text-base font-bold leading-normal text-slate-800">
          뱃지 정보
        </div>
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
          alt="배지"
          width={184}
          height={184}
        />
        <div className="flex h-12 flex-col items-center justify-start">
          <div className="text-center text-base font-medium leading-normal text-slate-800">
            KISA 뱃지
          </div>
          <div className="self-stretch text-center text-base font-normal leading-normal text-slate-600">
            상단 뱃지에 관한 정보가 입력됩니다.
          </div>
        </div>
        <div className="flex h-[84px] flex-col items-start justify-start gap-2 self-stretch">
          <button className="flex h-[39px] flex-col items-start justify-start gap-2 self-stretch">
            <div className="inline-flex items-center justify-center gap-2.5 self-stretch overflow-hidden rounded bg-[#ff823b] px-3 py-[9px]">
              <div className="text-center text-sm font-bold leading-[21px] text-white">
                뱃지 신청하기
              </div>
            </div>
          </button>
          <button
            onClick={() => setIsBadgeInfoModalOpen(false)}
            className="inline-flex items-center justify-center gap-2.5 self-stretch overflow-hidden rounded bg-slate-100/0 px-3 py-2"
          >
            <div className="text-center text-sm font-bold leading-[21px] text-slate-500">
              닫기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
