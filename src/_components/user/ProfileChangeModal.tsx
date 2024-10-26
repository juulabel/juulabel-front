"use client";

import Image from "next/image";

interface IProfileChangeModal {
  handleSelectImg: () => void;  
  handleDeleteImg: () => void;
  handleCancel: () => void;
}

export default function ProfileChangeModal({
  handleSelectImg,  
  handleDeleteImg,
  handleCancel,
}: IProfileChangeModal) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="inline-flex h-[177px] w-[91%] max-w-[560px] flex-col items-center justify-center gap-[9px] rounded-2xl bg-white p-6">
        <button
          onClick={handleSelectImg}
          className="inline-flex cursor-pointer items-center justify-center gap-2.5 self-stretch rounded bg-slate-950 px-3 py-2 text-center text-sm font-bold leading-[21px] text-white"
        >
          이미지 변경하기
        </button> 
        <button
          onClick={handleDeleteImg}
          className="bg-slate-100/opacity-0 inline-flex cursor-pointer items-center justify-center gap-2.5 self-stretch rounded bg-slate-100 px-3 py-2 text-center text-sm font-bold leading-[21px] text-slate-500"
        >
          이미지 삭제하기
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
