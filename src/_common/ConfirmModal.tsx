"use client";

import Image from "next/image";

interface IConfirmModal {
  modalTitle: string;
  modalDescription: string;
  confirmText: string;
  cancelText: string;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export default function ConfirmModal({
  modalTitle,
  modalDescription,
  confirmText,
  cancelText,
  handleConfirm,
  handleCancel,
}: IConfirmModal) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="inline-flex h-[265px] w-[91%] max-w-[560px] flex-col items-center justify-center gap-6 rounded-2xl bg-white p-6">
        <div className="flex h-[111px] flex-col items-center justify-center gap-3 self-stretch">
          <Image
            width={44}
            height={40}
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/register_cancel_warning.png`}
            alt="경고"
          />
          <div className="flex h-[59px] flex-col items-start justify-start gap-2 self-stretch">
            <div className="self-stretch text-center text-lg font-bold leading-[27px] text-slate-800">
              {modalTitle}
            </div>
            <div className="self-stretch text-center text-base font-normal leading-normal text-slate-600">
              {modalDescription}
            </div>
          </div>
        </div>
        <div className="flex h-[82px] flex-col items-start justify-start gap-2 self-stretch">
          <div className="inline-flex items-center justify-center gap-2.5 self-stretch rounded bg-slate-950 px-3 py-2">
            <button
              onClick={handleConfirm}
              className="text-center text-sm font-bold leading-[21px] text-white"
            >
              {confirmText}
            </button>
          </div>
          <div className="bg-slate-100/opacity-0 inline-flex items-center justify-center gap-2.5 self-stretch rounded px-3 py-2">
            <button
              onClick={handleCancel}
              className="text-center text-sm font-bold leading-[21px] text-slate-500"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
