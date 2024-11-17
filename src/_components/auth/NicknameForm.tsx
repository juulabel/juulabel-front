"use client";

import {
  nicknameDefaultValues,
  NicknameUserFormValues,
} from "@/_types/yup/yupRegister";
import { AiFillExclamationCircle } from "react-icons/ai";
import BottomButton from "@/_common/BottomButton";
import { useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { instance } from "@/app/api/axios";
import { useRegisterStore } from "@/_store/register";

export default function NicknameForm() {
  const { setNickname } = useRegisterStore();
  const [nicknamePass, setNicknamePass] = useState<string>("");
  const [enableButton, setEnableButton] = useState<boolean>(false);
  const {
    watch,
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<NicknameUserFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: nicknameDefaultValues,
  });

  const nicknameWatch = watch("nickname") ?? "";
  const nicknameLength = nicknameWatch.length;

  const onSubmit = async (data: NicknameUserFormValues) => {
    try {
      const regex = /[^\w\u00C0-\uFFFF]/g;
      if (regex.test(data.nickname)) {
        setError("nickname", {
          message: "띄어쓰기 및 특수문자를 사용할수 없어요.",
        });
        return;
      }
      const response = await instance.get(
        `/v1/api/members/nicknames/${data.nickname}/exists`,
      );

      if (response.data) {
        if (!response.data.result) {
          setEnableButton(true);
          clearErrors("nickname");
          setNicknamePass("사용 가능한 닉네임이에요.");
        } else {
          setNicknamePass("");
          setError("nickname", { message: "이미 사용중인 닉네임이에요." });
        }
      }
    } catch (error) {
      setNicknamePass("");
      setError("nickname", {
        message: "에러가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };



  const saveNicknameData = () => {
    setNickname(getValues("nickname"));
  };
  useEffect(() => {
    clearErrors("nickname");
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-[4%] mb-4">
        <input
          className="h-11 w-full rounded-[6px] border-[1px] border-solid border-cool-grayscale-300 p-4"
          placeholder="닉네임을 입력해주세요."
          {...register("nickname")}
          maxLength={8}
        />
        {errors.nickname && errors.nickname.message && (
          <div className="mt-1 flex flex-row items-center">
            <AiFillExclamationCircle className="mr-[2px] text-error" />
            <p className="text-[13px] font-medium text-error">
              {errors.nickname.message}
            </p>
          </div>
        )}
        {nicknamePass && !errors.nickname?.message?.length && (
          <div className="mt-1 flex flex-row items-center">
            <FaCheckCircle className="mr-[2px] text-success" />
            <p className="text-[13px] font-medium text-success">
              {nicknamePass}
            </p>
          </div>
        )}
        {nicknameWatch ? (
          <p className="my-0 flex justify-end">{nicknameWatch.length}/8</p>
        ) : (
          <p className="my-0 flex justify-end">0/8</p>
        )}
      </div>
      <button
        type="submit"
        className={`mx-[4%] flex w-[91%] justify-center rounded-[10px] py-[14px] text-center text-white ${nicknameLength >= 2 ? "bg-black" : "pointer-events-none bg-[#C4C4C4]"}`}
      >
        중복 검사
      </button>
      <BottomButton
        url="/register/details"
        enableButton={enableButton}
        onClick={saveNicknameData}
      >
        다음
      </BottomButton>
    </form>
  );
}
