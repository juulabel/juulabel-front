"use client";

import TopHeader from "@/_common/TopHeader";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import { Controller, useFormContext } from "react-hook-form";
import { RegisterUserFormValues } from "@/_types/yup/yupRegister";

export default function Page() {
  const { control, watch, setValue } = useFormContext<RegisterUserFormValues>();

  const handleAllAgree = (value: boolean) => {
    setValue("serviceAgree", value);
    setValue("privateInformationAgree", value);
    setValue("marketingAgree", value);
  };

  const allAgreeWatch = watch("allAgree");
  const serviceAgreeWatch = watch("serviceAgree");
  const privateInformationAgreeWatch = watch("privateInformationAgree");
  return (
    <div className="w-[400px]">
      <TopHeader title="회원가입" backUrl="/login" step={1} rest={2} />
      <div className="my-10">
        <h2 className="font-bold text-xl">
          주라벨을 사용하려면 <br /> 아래에 대한 약관 동의가 필요해요
        </h2>
      </div>

      <form>
        <div className="w-[400px] absolute bottom-24">
          <div className="flex items-end">
            <label className="flex flex-row items-center my-3">
              <Controller
                name="allAgree"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="checkbox"
                    className="mr-1 w-[18px] h-[18px] cursor-pointer rounded bg-slate-300 appearance-none before:content-['\2714'] before:text-white before:pl-[3px]  checked:bg-active"
                    checked={value}
                    onChange={(e) => {
                      onChange(e.target.checked);
                      handleAllAgree(e.target.checked);
                    }}
                  />
                )}
              ></Controller>

              <span className="flex flex-row font-medium text-base text-[#475569]">
                <p className="font-bold text-lg mx-1">약관 전체동의</p> 선택동의 포함
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between my-2">
            <label>
              <Controller
                name="serviceAgree"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="mr-1 w-[18px] h-[18px] cursor-pointer rounded bg-slate-300 appearance-none before:content-['\2714'] before:text-white before:pl-[3px] checked:bg-active"
                  />
                )}
              ></Controller>
              <span className="text-base font-medium text-[#1E293B]">서비스 이용약관(필수)</span>
            </label>
            <GoChevronRight size={24} className="text-[#64748B]" />
          </div>
          <div className="flex items-center justify-between my-3">
            <label>
              <Controller
                name="privateInformationAgree"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="mr-1 w-[18px] h-[18px] cursor-pointer rounded bg-slate-300 appearance-none before:content-['\2714'] before:text-white before:pl-[3px] checked:bg-active"
                  />
                )}
              ></Controller>
              <span className="text-base font-medium text-[#1E293B]">개인정보 수집 및 이용동의(필수)</span>
            </label>
            <GoChevronRight size={24} className="text-[#64748B]" />
          </div>
          <div className="flex items-center justify-between my-3">
            <label>
              <Controller
                name="marketingAgree"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="mr-1 w-[18px] h-[18px] cursor-pointer rounded bg-slate-300 appearance-none before:content-['\2714'] before:text-white before:pl-[3px] checked:bg-active"
                  />
                )}
              ></Controller>

              <span className="text-base font-medium text-[#1E293B]">마케팅 수신동의(선택)</span>
            </label>
            <GoChevronRight size={24} className="text-[#64748B]" />
          </div>
        </div>
        <Link
          className={`w-[400px] m-auto py-[14px] text-center font-bold text-base text-white items-center rounded-[10px] absolute inset-x-0 bottom-2 ${allAgreeWatch || (serviceAgreeWatch && privateInformationAgreeWatch) ? "bg-[#FF823C]" : "bg-[#FFC4A2] pointer-events-none"}`}
          href="/register/name"
        >
          다음
        </Link>
      </form>
    </div>
  );
}
