"use client";

import BottomButton from "@/_common/BottomButton";
import Loading from "@/_common/Loading";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import {
  basicInformationDefaultValues,
  BasicInformationFormValues,
} from "@/_types/yup/yupTastingNote";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";

interface IUnOfficialBasicInformationForm {
  handleStep: () => void;
}

export default function UnOfficialBasicInformationForm({
  handleStep,
}: IUnOfficialBasicInformationForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<BasicInformationFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: basicInformationDefaultValues,
  });
  const { data: alcoholType, isLoading: isLoadingAlcoholType } = useQuery({
    queryKey: ["alcoholType"],
    queryFn: getAlcoholType,
  });
  const formProductName = watch("productName");
  const formAlcoholContent = watch("alcoholContent");
  const formAlcoholType = watch("alcoholType");
  const formBrewery = watch("brewery");
  const enableButton = !!(
    formProductName &&
    formAlcoholContent &&
    formAlcoholType &&
    isValid
  );

  const validateAlcoholContent = (value: string) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1})?$/;
    return regex.test(value);
  };
  const saveBasicInformation = () => {
    tastingNoteInformationStore.setProductName(formProductName);
    tastingNoteInformationStore.setAlcoholContent(formAlcoholContent);
    tastingNoteInformationStore.setAlcoholType(formAlcoholType);
    tastingNoteInformationStore.setBrewery(formBrewery ? formBrewery : "");
  };
  const handleNextButton = () => {
    saveBasicInformation();
    handleStep();
  };
  if (isLoadingAlcoholType) return <Loading />;
  return (
    <>
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          전통주 기본 정보
        </p>
        <p className="text-sm font-medium text-cool-grayscale-500">
          기록하실 전통주의 기본 정보를 입력해주세요.
        </p>
      </div>
      <form>
        <div className="mb-6 flex flex-col justify-center">
          <label
            htmlFor="productName"
            className="text-base font-bold text-cool-grayscale-800"
          >
            제품명
          </label>
          <input
            className="mt-[1%] h-11 w-full rounded-[6px] border-[1px] border-cool-grayscale-300 px-[10px] py-4"
            placeholder="전통주의 이름을 띄어쓰기 없이 입력해주세요."
            {...register("productName")}
            onInput={(event: FormEvent<HTMLInputElement>) => {
              const value = event.currentTarget.value;
              event.currentTarget.value = value.replace(/\s+/g, "");
            }}
          />
        </div>
        <div className="mb-6 flex flex-col justify-center">
          <label
            htmlFor="alcoholContent"
            className="text-base font-bold text-cool-grayscale-800"
          >
            도수
          </label>
          <div className="flex items-center">
            <input
              className="mr-[3%] mt-[1%] h-11 w-full rounded-[6px] border-[1px] border-cool-grayscale-300 px-[10px] py-4"
              placeholder="전통주의 도수를 숫자로만 기입해주세요."
              {...register("alcoholContent", {
                required: "도수를 입력해 주세요.",
                validate: (value) =>
                  validateAlcoholContent(value) ||
                  "도수를 숫자로만 기입해주세요.",
              })}
              onInput={(event: FormEvent<HTMLInputElement>) => {
                const value = event.currentTarget.value;
                const regex = /^[0-9]*\.?[0-9]?$/;
                if (!regex.test(value)) {
                  event.currentTarget.value = value.slice(0, -1);
                }
              }}
            />
            <p className="text-lg font-bold text-cool-grayscale-800">%</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col justify-center">
          <label
            htmlFor="alcoholType"
            className="text-base font-bold text-cool-grayscale-800"
          >
            주종
          </label>
          <div className="relative mt-[1%] h-11 w-full rounded-[6px] border-[1px] border-cool-grayscale-300">
            <select
              {...register("alcoholType", {
                required: "주종을 선택하여 주세요",
              })}
              className="h-full w-full appearance-none rounded-[6px] bg-cool-grayscale-50 px-[4%]"
              defaultValue="" // 기본값 설정
            >
              <option value="" disabled hidden>
                주종을 선택하여 주세요
              </option>
              {alcoholType.alcoholTypeInfos.map(
                (alcohol: { id: number; name: string; image: string }) => (
                  <option
                    key={alcohol.id}
                    value={alcohol.name}
                    className="bg-white py-2 text-sm font-normal text-cool-grayscale-700"
                  >
                    {alcohol.name}
                  </option>
                ),
              )}
            </select>
            {/* 커스텀 화살표 */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <Image
                width={24}
                height={24}
                src="/svg/down_arrow.svg"
                alt="Dropdown Icon"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <label
            htmlFor="brewery"
            className="flex items-center text-base font-bold text-cool-grayscale-800"
          >
            양조장
            <p className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
              선택사항
            </p>
          </label>
          <input
            className="mr-[3%] mt-[1%] h-11 w-full rounded-[6px] border-[1px] border-cool-grayscale-300 px-[10px] py-4"
            placeholder="양조장의 이름을 띄어쓰기 없이 입력해주세요."
            onInput={(event: FormEvent<HTMLInputElement>) => {
              const value = event.currentTarget.value;
              event.currentTarget.value = value.replace(/\s+/g, "");
            }}
          />
        </div>
        <BottomButton enableButton={enableButton} onClick={handleNextButton}>
          다음
        </BottomButton>
      </form>
    </>
  );
}
