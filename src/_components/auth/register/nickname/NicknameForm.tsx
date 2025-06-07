"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { instance } from "@/app/api/axios";
import BottomButton from "@/_common/BottomButton";
import { useRegisterStore } from "@/_store/register";
import {
  nicknameDefaultValues,
  NicknameUserFormValues,
} from "@/_types/yup/yupRegister";

export default function NicknameForm({ onNext }: { onNext: () => void }) {
  const { setNickname } = useRegisterStore();
  const [nicknamePass, setNicknamePass] = useState<string>("");
  const [enableButton, setEnableButton] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isValidNickname, setIsValidNickname] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    watch,
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<NicknameUserFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: nicknameDefaultValues,
  });

  const nicknameWatch = watch("nickname") ?? "";
  const nicknameLength = nicknameWatch.length;

  // 닉네임 유효성 검사
  useEffect(() => {
    if (!nicknameWatch) {
      setIsValidNickname(false);
      setErrorMessage("");
      return;
    }

    // 유효성 검사 규칙
    const validationRules = [
      {
        test: () => /[^\w\u00C0-\uFFFF]/g.test(nicknameWatch),
        message: "띄어쓰기 및 특수문자를 사용할 수 없어요.",
      },
      {
        test: () => {
          const hasConsonantOnly = /[ㄱ-ㅎ]/.test(nicknameWatch);
          const hasVowelOnly = /[ㅏ-ㅣ]/.test(nicknameWatch);
          const hasMixedConsonantAndEnglish =
            /[ㄱ-ㅎ].*[a-zA-Z]|[a-zA-Z].*[ㄱ-ㅎ]/.test(nicknameWatch);
          return (
            hasConsonantOnly || hasVowelOnly || hasMixedConsonantAndEnglish
          );
        },
        message:
          "자음만, 모음만, 또는 자음과 영어가 섞인 닉네임은 사용할 수 없어요.",
      },
      {
        test: () => nicknameWatch.length < 2,
        message: "닉네임은 최소 2자 이상이어야 해요.",
      },
    ];

    // 유효성 검사 실행
    for (const rule of validationRules) {
      if (rule.test()) {
        setError("nickname", {
          type: "manual",
          message: rule.message,
        });
        setErrorMessage(rule.message);
        setIsValidNickname(false);
        return;
      }
    }

    // 모든 검사를 통과하면 에러 초기화
    clearErrors("nickname");
    setErrorMessage("");
    setIsValidNickname(true);
  }, [nicknameWatch, setError, clearErrors]);

  const onSubmit = useCallback(
    async (data: NicknameUserFormValues) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const response = await instance.get(
          `/v1/api/members/nicknames/${data.nickname}/exists`,
        );

        if (response.data) {
          if (!response.data.result) {
            setEnableButton(true);
            clearErrors("nickname");
            setErrorMessage("");
            setNicknamePass("사용 가능한 닉네임이에요.");
          } else {
            setNicknamePass("");
            setError("nickname", {
              type: "manual",
              message: "이미 사용중인 닉네임이에요.",
            });
            setErrorMessage("이미 사용중인 닉네임이에요.");
            setIsValidNickname(false);
          }
        }
      } catch (error) {
        setNicknamePass("");
        setError("nickname", {
          type: "manual",
          message: "에러가 발생했습니다. 다시 시도해주세요.",
        });
        setErrorMessage("에러가 발생했습니다. 다시 시도해주세요.");
        setIsValidNickname(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, clearErrors, setError],
  );

  // const saveNicknameData = useCallback(() => {
  //   setNickname(getValues("nickname"));
  // }, [getValues, setNickname]);
  const saveNicknameData = useCallback(() => {
    setNickname(getValues("nickname"));
    onNext();
  }, [getValues, setNickname, onNext]);

  useEffect(() => {
    clearErrors("nickname");
    setErrorMessage("");
  }, [clearErrors]);

  const isButtonDisabled =
    isSubmitting || !isValidNickname || nicknameLength < 2;
  const buttonClassName = `mx-[4%] flex w-[91%] justify-center rounded-[10px] py-[14px] text-center text-white ${
    isValidNickname && nicknameLength >= 2 && !isSubmitting
      ? "bg-black"
      : "pointer-events-none bg-[#C4C4C4]"
  }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mx-[4%] mb-4">
        <input
          className="h-11 w-full rounded-[6px] border-[1px] border-solid border-cool-grayscale-300 p-4"
          placeholder="닉네임을 입력해주세요."
          {...register("nickname")}
          maxLength={8}
        />
        {errorMessage && (
          <div className="mt-1 flex flex-row items-center">
            <AiFillExclamationCircle className="mr-[2px] text-error" />
            <p className="text-[13px] font-medium text-error">{errorMessage}</p>
          </div>
        )}
        {nicknamePass && !errorMessage && (
          <div className="mt-1 flex flex-row items-center">
            <FaCheckCircle className="mr-[2px] text-success" />
            <p className="text-[13px] font-medium text-success">
              {nicknamePass}
            </p>
          </div>
        )}
        <p className="my-0 flex justify-end">{nicknameLength}/8</p>
      </div>
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={buttonClassName}
        onClick={() => handleSubmit(onSubmit)()}
      >
        중복 검사
      </button>
      <BottomButton enableButton={enableButton} onClick={saveNicknameData}>
        다음
      </BottomButton>
    </form>
  );
}
