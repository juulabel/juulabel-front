"use client";

import Image from "next/image";

interface IRegisterCancel {
  handleRegisterCancel: () => void;
  handleRegisterCancelModalClose: () => void;
}

export default function RegisterCancelModal({
  handleRegisterCancel,
  handleRegisterCancelModalClose,
}: IRegisterCancel) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="inline-flex h-[265px] w-[361px] flex-col items-center justify-start gap-6 rounded-2xl bg-white p-6">
        <div className="flex h-[111px] flex-col items-center justify-center gap-3 self-stretch">
          <Image
            width={44}
            height={40}
            src="/images/register_cancel_warning.png"
            alt="경고"
          />
          <div className="flex h-[59px] flex-col items-start justify-start gap-2 self-stretch">
            <div className="self-stretch text-center font-['Pretendard'] text-lg font-bold leading-[27px] text-slate-800">
              회원가입을 중단하시겠어요?
            </div>
            <div className="self-stretch text-center font-['Pretendard'] text-base font-normal leading-normal text-slate-600">
              마지막 단계에요! 그래도 중단하시겠어요?
            </div>
          </div>
        </div>
        <div className="flex h-[82px] flex-col items-start justify-start gap-2 self-stretch">
          <div className="inline-flex items-center justify-center gap-2.5 self-stretch rounded bg-slate-950 px-3 py-2">
            <button
              onClick={handleRegisterCancel}
              className="text-center font-['Pretendard'] text-sm font-bold leading-[21px] text-white"
            >
              중단하기
            </button>
          </div>
          <div className="bg-slate-100/opacity-0 inline-flex items-center justify-center gap-2.5 self-stretch rounded px-3 py-2">
            <button
              onClick={handleRegisterCancelModalClose}
              className="text-center font-['Pretendard'] text-sm font-bold leading-[21px] text-slate-500"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
