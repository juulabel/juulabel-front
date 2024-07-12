"use client";

import { RegisterUserFormValues } from "@/_types/yup/yupRegister";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillExclamationCircle } from "react-icons/ai";
import BottomButton from "@/_common/BottomButton";

export default function NicknameForm() {
  const [nicknamePass, setNicknamePass] = useState<string>("");
  const [enableButton, setEnableButton] = useState<boolean>(false);
  const {
    watch,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useFormContext<RegisterUserFormValues>();

  const nicknameWatch = watch("nickname");

  const onClickNext = async (data: RegisterUserFormValues) => {
    const response = await axios.post(
      "https://api.example.com/api/register/nickname",
      data.nickname,
    );
    if (response.data.data.isAble) {
      setEnableButton(true);
      setError("nickname", { message: "" });
      setNicknamePass("사용 가능한 닉네임이에요.");
      console.log("1");
    } else {
      setError("nickname", { message: "이미 사용중인 닉네임이에요." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onClickNext)}>
      <div className="mb-4 w-[393px]">
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
        {nicknamePass && (
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
        className={`m-auto flex justify-center rounded-[10px] bg-black px-[151px] py-[14px] text-center text-white`}
      >
        중복 검사
      </button>
      <BottomButton url="/register/details" enableButton={enableButton}>
        다음
      </BottomButton>
    </form>
  );
}
