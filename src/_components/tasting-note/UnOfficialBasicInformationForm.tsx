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
import { useForm } from "react-hook-form";

interface IUnOfficialBasicInformationForm {
  handleStep: () => void;
}

export default function UnOfficialBasicInformationForm({
  handleStep,
}: IUnOfficialBasicInformationForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const { register, watch } = useForm<BasicInformationFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: basicInformationDefaultValues,
  });
  const { data: alcoholType, isLoading: isLoadingAlcoholType } = useQuery({
    queryKey: ["alcoholType"],
    queryFn: getAlcoholType,
  });
  let formProductName = watch("productName");
  let formAlcoholContent = watch("alcoholContent");
  let formAlcoholType = watch("alcoholType");
  let formBrewery = watch("brewery");
  let enableButton = !!(
    formProductName &&
    formAlcoholContent &&
    formAlcoholType
  );

  const saveBasicInformation = () => {
    tastingNoteInformationStore.setProductName(formProductName);
    tastingNoteInformationStore.setAlcoholContent(formAlcoholContent);
    tastingNoteInformationStore.setAlcoholType(formAlcoholType);
    tastingNoteInformationStore.setBrewery(formBrewery ? formBrewery : "");
    handleStep();
  };
  if (isLoadingAlcoholType) return <Loading />;
  return (
    <form className="mx-[4%] mt-[4.5vh] flex flex-col">
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
            {...register("alcoholContent")}
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
            <img
              src="/svg/down_arrow.svg"
              alt="Dropdown Icon"
              className="h-6 w-6"
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
        />
      </div>
      <BottomButton enableButton={enableButton} onClick={saveBasicInformation}>
        다음
      </BottomButton>
    </form>
  );
}
