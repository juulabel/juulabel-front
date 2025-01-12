"use client";

import {
  AgreementUserFormValues,
  termsMapping,
} from "@/_types/yup/yupRegister";
import { Controller, useForm } from "react-hook-form";
import { useRegisterStore } from "@/_store/register";
import BottomButton from "@/_common/BottomButton";
import { useQuery } from "@tanstack/react-query";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import Checkbox from "@/_common/Checkbox";
import { getTerms } from "@/app/api/auth/register/getTerms";
import { useEffect } from "react";

export default function RegisterAgreementForm() {
  const router = useRouter();
  const {
    data: terms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
  });

  const {
    allAgree,
    serviceAgree,
    privateInformationAgree,
    marketingAgree,
    setAllAgree,
    setServiceAgree,
    setPrivateInformationAgree,
    setMarketingAgree,
  } = useRegisterStore();

  // useForm 초기값을 zustand에서 가져옴
  const { control, watch, setValue, getValues } =
    useForm<AgreementUserFormValues>({
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      defaultValues: {
        allAgree: allAgree,
        serviceAgree: serviceAgree.isAgreed,
        privateInformationAgree: privateInformationAgree.isAgreed,
        marketingAgree: marketingAgree.isAgreed,
      },
    });

  // zustand에 상태 저장
  const saveAgreementData = () => {
    setAllAgree(getValues("allAgree"));
    setServiceAgree(getValues("serviceAgree"));
    setPrivateInformationAgree(getValues("privateInformationAgree"));
    setMarketingAgree(getValues("marketingAgree"));
  };

  // 리렌더링 시 zustand 상태 반영
  useEffect(() => {
    setValue("allAgree", allAgree);
    setValue("serviceAgree", serviceAgree.isAgreed);
    setValue("privateInformationAgree", privateInformationAgree.isAgreed);
    setValue("marketingAgree", marketingAgree.isAgreed);
  }, [
    allAgree,
    serviceAgree,
    privateInformationAgree,
    marketingAgree,
    setValue,
  ]);

  const handleAllAgree = (value: boolean) => {
    setValue("allAgree", value); // Update allAgree state
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
  const marketingAgreeWatch = watch("marketingAgree");

  // Automatically update "allAgree" if any checkbox is unchecked
  useEffect(() => {
    const allTermsAgreed =
      serviceAgreeWatch && privateInformationAgreeWatch && marketingAgreeWatch;
    setValue("allAgree", allTermsAgreed);
  }, [
    serviceAgreeWatch,
    privateInformationAgreeWatch,
    marketingAgreeWatch,
    setValue,
  ]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error : {error.message}</div>;

  return (
    <form className="w-full max-w-[560px]">
      <div>
        <label className="mx-[4%] my-4 flex flex-row items-center">
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
        {terms.usedTermsInfos.map(
          (term: {
            id: number;
            title: string;
            type: string;
            isRequired: boolean;
          }) => {
            const termType = term.type as keyof typeof termsMapping;
            return (
              <div
                key={term.id}
                className="mx-[4%] my-4 flex items-center justify-between"
              >
                <label className="flex flex-row">
                  <Controller
                    name={termsMapping[termType]}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox checked={value} onChange={onChange} />
                    )}
                  />
                  <span className="text-base font-medium text-[#1E293B]">
                    {term.title} {term.isRequired ? "(필수)" : "(선택)"}
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
