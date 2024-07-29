"use client";

import {
  agreementDefaultValues,
  AgreementUserFormValues,
  termsMapping,
} from "@/_types/yup/yupRegister";
import { Controller, useForm } from "react-hook-form";
import { useRegisterStore } from "@/_store/register";
import BottomButton from "@/_common/BottomButton";
import { useQuery } from "@tanstack/react-query";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import requests from "@/app/api/requests";
import Checkbox from "@/_common/Checkbox";
import axios from "@/app/api/axios";
import { getTerms } from "@/app/api/auth/register/getTerms";

export default function RegisterAgreementForm() {
  const router = useRouter();
  const registerStore = useRegisterStore();
  const {
    data: terms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
  });
  const { control, watch, setValue, getValues } =
    useForm<AgreementUserFormValues>({
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      defaultValues: agreementDefaultValues,
    });

  const handleAllAgree = (value: boolean) => {
    setValue("serviceAgree", value);
    setValue("privateInformationAgree", value);
    setValue("marketingAgree", value);
  };

  const handleDocumentButton = (value: number) => {
    router.push(`/register/document/${value}`);
  };

  const allAgreeWatch = watch("allAgree");
  const serviceAgreeWatch = watch("serviceAgree");
  const privateInformationAgreeWatch = watch("privateInformationAgree");

  const saveAgreementData = () => {
    registerStore.setAllAgree(getValues("allAgree"));
    registerStore.setServiceAgree(getValues("serviceAgree"));
    registerStore.setPrivateInformationAGree(
      getValues("privateInformationAgree"),
    );
    registerStore.setMarketingAgree(getValues("marketingAgree"));
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error : {error.message}</div>;
  return (
    <form>
      <div className="absolute bottom-24 w-[393px]">
        <div className="flex items-end">
          <label className="my-3 flex flex-row items-center">
            <Controller
              name="allAgree"
              control={control}
              defaultValue={false}
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
        {terms.usedTermsInfos.map(
          (term: {
            id: number;
            title: string;
            type: string;
            is_required: boolean;
          }) => {
            const termType = term.type as keyof typeof termsMapping;
            return (
              <div
                key={term.id}
                className="my-3 flex items-center justify-between"
              >
                <label>
                  <Controller
                    name={termsMapping[termType]}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox checked={value} onChange={onChange} />
                    )}
                  />
                  <span className="text-base font-medium text-[#1E293B]">
                    {term.title} {term.is_required ? "(필수)" : "(선택)"}
                  </span>
                </label>
                <GoChevronRight
                  size={24}
                  className="text-[#64748B]"
                  onClick={() => handleDocumentButton(term.id)}
                />
              </div>
            );
          },
        )}
      </div>
      <BottomButton
        url="/register/name"
        enableButton={
          allAgreeWatch || (serviceAgreeWatch && privateInformationAgreeWatch)
        }
        onClick={saveAgreementData}
      >
        다음
      </BottomButton>
    </form>
  );
}
