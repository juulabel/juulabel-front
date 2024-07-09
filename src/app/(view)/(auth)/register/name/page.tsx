"use client";

import TopHeader from "@/_common/TopHeader";
import { RegisterUserFormValues } from "@/_types/yup/yupRegister";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillExclamationCircle } from "react-icons/ai";

export default function Page() {
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
    const response = await axios.post("https://api.example.com/api/register/nickname", data.nickname);
    if (response.data.data.isAble) {
      setEnableButton(true);
      setError("nickname", { message: "" });
      setNicknamePass("사용 가능한 닉네임이에요.");
    } else {
      setError("nickname", { message: "이미 사용중인 닉네임이에요." });
    }
  };

  return (
    <div className="w-[400px]">
      <TopHeader title="회원가입" backUrl="/register/agreement" step={2} rest={1} />
      <div className="flex flex-col mt-10 mb-4">
        <h2 className="font-bold text-xl my-1">닉네임을 설정해주세요.</h2>
        <div className="flex flex-col text-sm text-[#475569] font-medium my-1">
          <span>닉네임은 최소 2자, 최대 8자를 입력할 수 있어요.</span>
          <span>띄어쓰기 및 특수문자는 사용할 수 없어요.</span>
        </div>
        <span className="font-medium text-sm text-[#475569] my-1">닉네임은 추후 변경이 가능해요!</span>
      </div>

      <form onSubmit={handleSubmit(onClickNext)}>
        <div className="w-[400px] mb-4">
          <input
            className="border-[#CBD5E1] border-solid border-[1px] rounded-[6px] h-11 p-4 w-full"
            placeholder="닉네임을 입력해주세요."
            {...register("nickname")}
            maxLength={8}
          />
          {errors.nickname && errors.nickname.message && (
            <div className="flex flex-row items-center mt-1">
              <AiFillExclamationCircle className="text-[#ED0D00] mr-[2px]" />
              <p className="text-[#ED0D00] font-medium text-[13px] ">{errors.nickname.message}</p>
            </div>
          )}
          {nicknamePass && (
            <div className="flex flex-row items-center mt-1">
              <FaCheckCircle className="text-[#3BAE2B] mr-[2px] " />
              <p className="text-[#3BAE2B] font-medium text-[13px]">{nicknamePass}</p>
            </div>
          )}
          {nicknameWatch ? (
            <p className="flex justify-end my-0">{nicknameWatch.length}/8</p>
          ) : (
            <p className="flex justify-end my-0">0/8</p>
          )}
        </div>
        <button
          type="submit"
          className={`flex justify-center m-auto text-center px-[151px] py-[14px] rounded-[10px] text-white bg-black `}
        >
          중복 검사
        </button>
      </form>

      <Link
        className={`w-[400px] m-auto  py-[14px] text-center font-bold text-base text-white items-center rounded-[10px] absolute inset-x-0 bottom-2 ${enableButton ? "bg-[#FF823C]" : "bg-[#FFC4A2] pointer-events-none"}`}
        href="/register/details"
      >
        다음
      </Link>
    </div>
  );
}
