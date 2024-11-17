"use client";

import BottomButton from "@/_common/BottomButton";
import ConfirmModal from "@/_common/ConfirmModal";
import TopHeader from "@/_common/TopHeader";
import DetailsText from "@/_components/auth/DetailsText";
import GenderForm from "@/_components/auth/GenderForm";
import PreferredAlcoholForm from "@/_components/auth/PreferredAlcoholForm";
import RegisterConfirmModal from "@/_components/auth/RegisterConfirmModal";
import { useRegisterStore } from "@/_store/register";
import { instance } from "@/app/api/axios";
import requests from "@/app/api/requests";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const registerStore = useRegisterStore();
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const [alcoholTypes, setAlcoholTypes] = useState<number[]>([]);
  const [gender, setGender] = useState<string>("");
  const [genderDisable, setGenderDisable] = useState<boolean>(false);
  const [genderCheck, setGenderCheck] = useState<boolean>(false);
  const [registerConfirmModalOpen, setRegisterConfirmModalOpen] =
    useState<boolean>(false);
  const [registerCancelModalOpen, setRegisterCancelModalOpen] =
    useState<boolean>(false);

  const enableRegisterButton =
    (gender || genderCheck) && alcoholTypes.length ? true : false;
  let maleClicked = false;
  let femaleClicked = false;
  if (gender === "남성") {
    maleClicked = true;
    femaleClicked = false;
  } else if (gender === "여성") {
    maleClicked = false;
    femaleClicked = true;
  }

  const handleAlcoholType = (value: number) => {
    setAlcoholTypes((prevState) =>
      prevState.includes(value)
        ? prevState.filter((type: number) => type !== value)
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
      alcoholTypeIds: registerStore.preferredAlcoholType,
      termsAgreements: [
        registerStore.serviceAgree,
        registerStore.privateInformationAgree,
        registerStore.marketingAgree,
      ],
    };
    try {
      const response = await instance.post(requests.postSignUp, data);
      if (response.status === 200) {
        registerStore.setMemberId(response.data.result.memberId);
        setCookie("accessToken", response.data.result.token.accessToken, {
          path: "/",
        });
        router.push("/share/note");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenderCheck = (value: boolean) => {
    setGenderCheck(value);
    if (!genderCheck) {
      setGenderDisable(true);
      setGender("NONE");
    } else {
      setGenderDisable(false);
      setGender("");
    }
  };
  const handleGender = (value: string) => {
    if (value == gender) setGender("");
    else setGender(value);
  };

  return (
    registerStore.nickname && (
      <div className="h-full w-full max-w-[560px]">
        <TopHeader
          title="회원가입"
          step={3}
          rest={0}
          onClick={handleRegisterCancelModalOpen}
        />
        <DetailsText />
        <GenderForm
          genderCheck={genderCheck}
          maleClicked={maleClicked}
          femaleClicked={femaleClicked}
          genderDisable={genderDisable}
          onChangeGenderCheck={(value: boolean) => handleGenderCheck(value)}
          onChangeGender={(value: string) => handleGender(value)}
        />
        <div className="mt-6 h-[1px] w-[91%] bg-[lightly]" />
        <div className="mx-[4%] mt-6 flex flex-row justify-between">
          <p className="text-base font-semibold leading-6 text-cool-grayscale-700">
            선호전통주 주종 선택(필수)
          </p>
          <p className="text-sm font-normal leading-5 text-cool-grayscale-500">
            복수선택 가능
          </p>
        </div>
        <PreferredAlcoholForm
          alcoholTypes={alcoholTypes}
          onChangeAlcoholType={handleAlcoholType}
        />

        <BottomButton
          enableButton={enableRegisterButton}
          onClick={handleRegister}
        >
          회원가입 완료하기
        </BottomButton>
        {registerCancelModalOpen && (
          <ConfirmModal
            modalTitle="회원가입을 중단하시겠어요?"
            modalDescription="마지막 단계에요! 그래도 중단하시겠어요?"
            confirmText="중단하기"
            cancelText="닫기"
            handleConfirm={handleRegisterCancel}
            handleCancel={handleRegisterCancelModalClose}
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
