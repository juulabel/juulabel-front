"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RegisterSetup from "@/_components/auth/register/RegisterSetup";
import ConfirmModal from "@/_common/ConfirmModal";
import TopHeader from "@/_common/TopHeader";
import useFunnel from "@/_utils/hooks/useFunnel";

const STEPS = ["약관동의", "닉네임", "가입정보"];

export default function Page() {
  const { Funnel, currentStep, setStep } = useFunnel(STEPS[0]);
  const router = useRouter();
  const step = STEPS.indexOf(currentStep) + 1;
  const [registerCancelModalOpen, setRegisterCancelModalOpen] =
    useState<boolean>(false);

  const handleRegisterCancelModalOpen = () => {
    setRegisterCancelModalOpen(true);
  };

  const handleRegisterCancelModalClose = () => {
    setRegisterCancelModalOpen(false);
  };

  const handleStepChange = (newStep: string) => {
    if (STEPS.includes(newStep)) {
      setStep(newStep);
    }
  };

  const handleRegisterCancel = () => {
    router.replace("/");
  };

  const handleBack = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    } else {
      setStep(STEPS[0]);
    }
  };

  return (
    <>
      <TopHeader
        title="회원가입"
        step={step}
        rest={STEPS.length - step}
        goBack={() => handleBack()}
        onClick={handleRegisterCancelModalOpen}
      />
      <RegisterSetup
        steps={STEPS}
        onNext={handleStepChange}
        Funnel={Funnel}
        Step={Funnel.Step}
      />
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
    </>
  );
}
