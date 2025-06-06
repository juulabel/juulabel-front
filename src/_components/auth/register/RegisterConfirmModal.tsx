"use client";

import { useRegisterStore } from "@/_store/register";
import { alcoholType } from "@/_config/alcoholType";

interface IRegisterConfirm {
  handleRegisterConfirm: () => void;
  handleRegisterConfirmModalClose: () => void;
}

export default function RegisterConfirmModal({
  handleRegisterConfirm,
  handleRegisterConfirmModalClose,
}: IRegisterConfirm) {
  const {
    nickname,
    email,
    provider,
    gender,
    genderCheck,
    preferredAlcoholType,
  } = useRegisterStore();

  const preferredAlcoholValues = preferredAlcoholType
    .map((key) => alcoholType.find((type) => type.key === key)?.value)
    .filter((value) => value !== undefined);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="inline-flex h-[443px] w-[361px] flex-col items-center justify-start gap-4 rounded-2xl bg-white p-6">
        <div className="flex h-[155px] flex-col items-start justify-start gap-2 self-stretch">
          <div className="self-stretch text-center text-lg font-bold leading-[27px] text-slate-800">
            가입정보 확인
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <div className="text-center text-base font-normal leading-normal text-slate-600">
              닉네임
            </div>
            <div className="shrink grow basis-0 text-right text-base font-normal leading-normal text-slate-600">
              {nickname}
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <div className="text-center text-base font-normal leading-normal text-slate-600">
              아이디(이메일)
            </div>
            <div className="shrink grow basis-0 text-right text-base font-normal leading-normal text-slate-600">
              {email}
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <div className="text-center text-base font-normal leading-normal text-slate-600">
              가입방식
            </div>
            <div className="shrink grow basis-0 text-right text-base font-normal leading-normal text-slate-600">
              {provider === "KAKAO" ? "카카오톡" : "구글"}
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <div className="text-center text-base font-normal leading-normal text-slate-600">
              성별
            </div>
            <div className="shrink grow basis-0 text-right text-base font-normal leading-normal text-slate-600">
              {genderCheck
                ? "성별 체크 안함"
                : gender === "MALE"
                  ? "남성"
                  : "여성"}
            </div>
          </div>
        </div>
        <div className="inline-flex h-[0px] w-[313px] items-center justify-center"></div>
        <div className="flex h-[52px] flex-col items-start justify-start gap-1 self-stretch">
          <div className="self-stretch text-center text-base font-normal leading-normal text-slate-500">
            선호 전통주
          </div>
          <div className="self-stretch text-center text-base font-medium leading-normal text-orange-400">
            {preferredAlcoholValues.join(", ")}
          </div>
        </div>
        <div className="inline-flex h-[0px] w-[313px] items-center justify-center"></div>
        <div className="self-stretch text-center text-base font-bold leading-normal text-slate-700">
          입력하신 정보가 맞나요?
        </div>
        <div className="flex h-[84px] flex-col items-start justify-start gap-2 self-stretch">
          <div className="inline-flex items-center justify-center gap-2.5 self-stretch rounded bg-orange-400 px-3 py-[9px]">
            <button
              className="text-center text-sm font-bold leading-[21px] text-white"
              onClick={handleRegisterConfirm}
            >
              회원가입하기
            </button>
          </div>
          <div className="bg-slate-100/opacity-0 inline-flex items-center justify-center gap-2.5 self-stretch rounded px-3 py-2">
            <button
              onClick={handleRegisterConfirmModalClose}
              className="text-center text-sm font-bold leading-[21px] text-slate-500"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
