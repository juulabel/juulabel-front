import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/_utils/commons";

interface BadgeInfoModalProps {
  setIsBadgeInfoModalOpen: (isOpen: boolean) => void;
  showApplyButton?: boolean;
}

export default function BadgeInfoModal({
  setIsBadgeInfoModalOpen,
  showApplyButton = true,
}: BadgeInfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsBadgeInfoModalOpen(false);
  }, [setIsBadgeInfoModalOpen]);

  const handleApplyClick = useCallback(() => {
    window.open("https://tally.so/r/3XzlRe", "_blank");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="flex w-[377px] flex-col items-center rounded-2xl bg-white p-6"
      >
        <div className="mb-4 self-stretch text-center text-lg font-bold text-slate-800">
          뱃지 정보
        </div>
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`}
          alt="배지"
          width={120}
          height={120}
          className="mb-4"
        />
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-[8px] justify-start self-stretch text-center text-xl font-bold leading-7 text-slate-800">
            KISA 뱃지
          </div>
          <div className="mb-[4px] text-center text-sm text-slate-700">
            <span className="font-medium text-slate-800">
              'KISA 전통주 소믈리에 자격증'
            </span>{" "}
            보유자만
            <br />이 뱃지를 받을 수 있습니다.
          </div>
          {showApplyButton && (
            <div className="text-center text-sm text-slate-700">
              전통주에 대한 전문가의 평가는 단순한 리뷰가
              <br />
              아닌, 깊은 지식을 바탕으로 합니다.
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          {showApplyButton && (
            <button
              onClick={handleApplyClick}
              className="w-full rounded bg-[#ff823b] py-3 text-center text-sm font-bold text-white"
            >
              뱃지 신청하기
            </button>
          )}
          <button
            onClick={handleClose}
            className={cn(
              "w-full rounded py-3 text-center text-sm font-bold",
              showApplyButton ? "text-slate-500" : "bg-[#ff823b] text-white",
            )}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
