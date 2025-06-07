"use client";

import { useRegisterStore } from "@/_store/register";

export default function UserInfoText() {
  const registerStore = useRegisterStore();
  return (
    <div>
      <div className="mx-[4%] my-7">
        <h2 className="text-xl font-bold leading-7 text-cool-grayscale-800">
          마지막 단계에요!
        </h2>
        <h2 className="text-xl font-bold leading-7 text-[#334155]">
          본인에 대해서 조금만 알려주세요!
        </h2>
        <p className="text-sm leading-6 text-cool-grayscale-600">
          입력정보에 따른 시음노트와 피드를 추천해드릴게요!
        </p>
      </div>
      <div className="h-[1px] w-full bg-cool-grayscale-200" />
      <div className="mx-[4%] my-6">
        <p className="mb-2 text-base font-medium leading-6 text-cool-grayscale-700">
          가입 정보
        </p>
        <div className="mb-2 flex flex-row justify-between text-center">
          <p className="text-base font-normal leading-6 text-cool-grayscale-500">
            닉네임
          </p>
          <p className="text-base font-semibold leading-6 text-cool-grayscale-700">
            {registerStore.nickname}
          </p>
        </div>
        <div className="mb-2 flex flex-row justify-between text-center">
          <p className="text-base font-normal leading-6 text-cool-grayscale-500">
            아이디(이메일)
          </p>
          <p className="text-base font-semibold leading-6 text-cool-grayscale-700">
            {registerStore.email}
          </p>
        </div>
        <div className="mb-2 flex flex-row justify-between text-center">
          <p className="text-base font-normal leading-6 text-cool-grayscale-500">
            가입방식
          </p>
          <p className="text-base font-semibold leading-6 text-cool-grayscale-700">
            {registerStore.provider === "KAKAO" ? "카카오톡" : "구글"}
          </p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-cool-grayscale-200" />
    </div>
  );
}
