"use client";

import BottomButton from "@/_common/BottomButton";
import TopHeader from "@/_common/TopHeader";
import GenderForm from "@/_components/auth/GenderForm";
import PreferredAlcoholForm from "@/_components/auth/PreferredAlcoholForm";
import RegisterCancelModal from "@/_components/auth/RegisterCancelModal";
import RegisterConfirmModal from "@/_components/auth/RegisterConfirmModal";
import { useRegisterStore } from "@/_store/register";
import { getAlocholTypeIds } from "@/_utils/getAlcoholTypeIds";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page() {
  const registerStore = useRegisterStore();
  const router = useRouter();
  const [alcoholTypes, setAlcoholTypes] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("");
  const [genderDisable, setGenderDisable] = useState<boolean>(false);
  const [genderCheck, setGenderCheck] = useState<boolean>(false);
  const [registerConfirmModalOpen, setRegisterConfirmModalOpen] =
    useState<boolean>(false);
  const [registerCancelModalOpen, setRegisterCancelModalOpen] =
    useState<boolean>(false);
  let enableRegisterButton =
    (gender || genderCheck) && alcoholTypes.length ? true : false;
  let maleClicked = false;
  let femaleClicked = false;
  if (gender === "MALE") {
    maleClicked = true;
    femaleClicked = false;
  } else if (gender === "FEMALE") {
    maleClicked = false;
    femaleClicked = true;
  }

  const handleAlcoholType = (value: string) => {
    setAlcoholTypes((prevState) =>
      prevState.includes(value)
        ? prevState.filter((type: string) => type !== value)
        : [...prevState, value],
    );
  };
  const handleRegister = () => {
    registerStore.setGender(gender);
    registerStore.setGendercheck(genderCheck);
    registerStore.setPreferredAlcoholType(alcoholTypes);
    setRegisterConfirmModalOpen(true);
  };

  const handleRegisterConfirmModalClose = () => {
    setRegisterConfirmModalOpen(false);
  };

  const handleRegisterCancelModalOpen = () => {
    setRegisterCancelModalOpen(true);
  };

  const handleRegisterCancelModalClose = () => {
    setRegisterCancelModalOpen(false);
  };

  const handleRegisterCancel = () => {
    router.push("/");
  };

  const handleRegisterConfirm = async () => {
    const data = {
      email: registerStore.email,
      nickname: registerStore.nickname,
      gender: registerStore.gender,
      provider: registerStore.provider,
      providerId: registerStore.providerId,
      alcoholTypeIds: getAlocholTypeIds(registerStore.preferredAlcoholType),
      termsAgreements: [
        { termsId: 0, isAgreed: registerStore.serviceAgree },
        { termsId: 1, isAgreed: registerStore.privateInformationAgree },
        { termsId: 2, isAgreed: registerStore.marketingAgree },
      ],
    };
    console.log(data);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/sign-up`,
      data,
    );
    console.log(response);
  };

  const handleGenderCheck = (value: boolean) => {
    setGenderCheck(value);
    if (!genderCheck) {
      setGenderDisable(true);
      setGender("None");
    } else setGenderDisable(false);
  };
  const handleGender = (value: string) => {
    if (value == gender) setGender("");
    else setGender(value);
  };

  return (
    registerStore.nickname && (
      <div className="w-[393px]">
        <TopHeader
          backUrl="/register/name"
          title="회원가입"
          step={3}
          rest={0}
          onClick={handleRegisterCancelModalOpen}
        />
        <div className="ml-4 mt-7">
          <h2 className="font-[Pretendard] text-xl font-bold leading-7 text-cool-grayscale-800">
            마지막 단계에요!
          </h2>
          <h2 className="text-xl font-bold leading-7 text-[#334155]">
            본인에 대해서 조그만 알려주세요!
          </h2>
          <p className="font-[Pretendard] text-sm leading-6 text-cool-grayscale-600">
            입력정보에 따른 시음노트와 피드를 추천해드릴게요!
          </p>
        </div>
        <div className="mx-4 mt-12">
          <p className="mb-2 font-[Pretendard] text-base font-medium leading-6 text-cool-grayscale-700">
            가입 정보
          </p>
          <div className="mb-2 flex flex-row justify-between text-center">
            <p className="font-[Pretendard] text-base font-normal leading-6 text-cool-grayscale-500">
              닉네임
            </p>
            <p className="font-[Pretendard] text-base font-semibold leading-6 text-cool-grayscale-700">
              {registerStore.nickname}
            </p>
          </div>
          <div className="mb-2 flex flex-row justify-between text-center">
            <p className="font-[Pretendard] text-base font-normal leading-6 text-cool-grayscale-500">
              아이디(이메일)
            </p>
            <p className="font-[Pretendard] text-base font-semibold leading-6 text-cool-grayscale-700">
              {registerStore.email}
            </p>
          </div>
          <div className="mb-2 flex flex-row justify-between text-center">
            <p className="font-[Pretendard] text-base font-normal leading-6 text-cool-grayscale-500">
              가입방식
            </p>
            <p className="font-[Pretendard] text-base font-semibold leading-6 text-cool-grayscale-700">
              {registerStore.provider === "KAKAO" ? "카카오톡" : "구글"}
            </p>
          </div>
        </div>
        <div className="mt-6 h-[1px] w-[91%] bg-[lightly]" />
        <GenderForm
          genderCheck={genderCheck}
          maleClicked={maleClicked}
          femaleClicked={femaleClicked}
          genderDisable={genderDisable}
          onChangeGenderCheck={(value: boolean) => handleGenderCheck(value)}
          onChangeGender={(value: string) => handleGender(value)}
        />
        <div className="mt-6 h-[1px] w-[91%] bg-[lightly]" />
        <div>
          <div className="mt-6 flex flex-row justify-between">
            <p className="font-[Pretendard] text-base font-semibold leading-6 text-cool-grayscale-700">
              선호전통주 주종 선택(필수)
            </p>
            <p className="font-[Pretendard] text-sm font-normal leading-5 text-cool-grayscale-500">
              복수선택 가능
            </p>
          </div>
          <PreferredAlcoholForm
            alcoholTypes={alcoholTypes}
            onChangeAlcoholType={handleAlcoholType}
          />
        </div>

        <BottomButton
          enableButton={enableRegisterButton}
          onClick={handleRegister}
        >
          회원가입 완료하기
        </BottomButton>
        {registerCancelModalOpen && (
          <RegisterCancelModal
            handleRegisterCancelModalClose={handleRegisterCancelModalClose}
            handleRegisterCancel={handleRegisterCancel}
          />
        )}
        {registerConfirmModalOpen && (
          <RegisterConfirmModal
            handleRegisterConfirm={handleRegisterConfirm}
            handleRegisterConfirmModalClose={handleRegisterConfirmModalClose}
          />
        )}
      </div>
    )
  );
}
