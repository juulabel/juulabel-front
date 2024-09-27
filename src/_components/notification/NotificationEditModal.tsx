"use client";

import Image from "next/image";

interface INotificationEditModal {
  handleMarkAsRead: () => void;
  handleSelectionDelete: () => void;
  handleOpenDeleteAllModal: () => void;
  handleCancel: () => void;
}

export default function NotificationEditModal({
  handleMarkAsRead,
  handleSelectionDelete,
  handleOpenDeleteAllModal,
  handleCancel,
}: INotificationEditModal) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="inline-flex h-[223px] w-[91%] max-w-[560px] flex-col items-center justify-center gap-[9px] rounded-2xl bg-white p-6">
        <button
          onClick={handleMarkAsRead}
          className="inline-flex cursor-pointer items-center justify-center gap-2.5 self-stretch rounded bg-slate-950 px-3 py-2 text-center text-sm font-bold leading-[21px] text-white"
        >
          모두 읽은 상태로 표시
        </button>
        <button
          onClick={handleSelectionDelete}
          className="inline-flex cursor-pointer items-center justify-center gap-2.5 self-stretch rounded bg-slate-950 px-3 py-2 text-center text-sm font-bold leading-[21px] text-white"
        >
          선택 삭제
        </button>
        <button
          onClick={handleOpenDeleteAllModal}
          className="bg-slate-100/opacity-0 inline-flex cursor-pointer items-center justify-center gap-2.5 self-stretch rounded bg-slate-100 px-3 py-2 text-center text-sm font-bold leading-[21px] text-[#ed0d00]"
        >
          전체 삭제
        </button>
        <button
          onClick={handleCancel}
          className="bg-slate-100/opacity-0 inline-flex cursor-pointer items-center justify-center gap-2.5 self-stretch rounded px-3 py-2 text-center text-sm font-bold leading-[21px] text-slate-500"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
