"use client";

import { RegisterUserFormValues } from "@/_types/yup/yupRegister";
import { Controller, useFormContext } from "react-hook-form";
import { GoChevronRight } from "react-icons/go";
import Checkbox from "@/_common/Checkbox";
import BottomButton from "@/_common/BottomButton";

export default function RegisterAgreementForm() {
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
    <form>
      <div className="absolute bottom-24 w-[393px]">
        <div className="flex items-end">
          <label className="my-3 flex flex-row items-center">
            <Controller
              name="allAgree"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    handleAllAgree(e.target.checked);
                  }}
                />
              )}
            ></Controller>

            <span className="flex flex-row text-base font-medium text-[#475569]">
              <p className="mx-1 text-lg font-bold">약관 전체동의</p> 선택동의
              포함
            </span>
          </label>
        </div>

        <div className="my-2 flex items-center justify-between">
          <label>
            <Controller
              name="serviceAgree"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onChange={onChange} />
              )}
            ></Controller>
            <span className="text-base font-medium text-[#1E293B]">
              서비스 이용약관(필수)
            </span>
          </label>
          <GoChevronRight size={24} className="text-[#64748B]" />
        </div>
        <div className="my-3 flex items-center justify-between">
          <label>
            <Controller
              name="privateInformationAgree"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onChange={onChange} />
              )}
            ></Controller>
            <span className="text-base font-medium text-[#1E293B]">
              개인정보 수집 및 이용동의(필수)
            </span>
          </label>
          <GoChevronRight size={24} className="text-[#64748B]" />
        </div>
        <div className="my-3 flex items-center justify-between">
          <label>
            <Controller
              name="marketingAgree"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onChange={onChange} />
              )}
            ></Controller>

            <span className="text-base font-medium text-[#1E293B]">
              마케팅 수신동의(선택)
            </span>
          </label>
          <GoChevronRight size={24} className="text-[#64748B]" />
        </div>
      </div>
      <BottomButton
        url="/register/name"
        enableButton={
          allAgreeWatch || (serviceAgreeWatch && privateInformationAgreeWatch)
        }
      >
        다음
      </BottomButton>
    </form>
  );
}
