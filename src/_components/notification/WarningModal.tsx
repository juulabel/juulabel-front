"use client";

import Image from "next/image";

interface IWarningModal {
  modalTitle: string;
  confirmText: string;
  cancelText: string;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export default function WarningModal({
  modalTitle,
  confirmText,
  cancelText,
  handleConfirm,
  handleCancel,
}: IWarningModal) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="inline-flex h-[233px] w-[91%] max-w-[560px] flex-col items-center justify-center gap-6 rounded-2xl bg-white p-6">
        <div className="flex h-[79px] flex-col items-center justify-center gap-3 self-stretch">
          <Image
            width={44}
            height={40}
            src="/images/register_cancel_warning.png"
            alt="경고"
          />
          <div className="self-stretch text-center text-lg font-bold leading-[27px] text-slate-800">
            {modalTitle}
          </div>
        </div>
        <div className="flex h-[82px] flex-col items-start justify-start gap-2 self-stretch">
          <button
            onClick={handleConfirm}
            className="inline-flex items-center justify-center gap-2.5 self-stretch rounded bg-slate-950 px-3 py-2 text-center text-sm font-bold leading-[21px] text-white"
          >
            {confirmText}
          </button>
          <button
            onClick={handleCancel}
            className="bg-slate-100/opacity-0 inline-flex items-center justify-center gap-2.5 self-stretch rounded px-3 py-2 text-center text-sm font-bold leading-[21px] text-slate-500"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
