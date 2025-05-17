"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState, MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import BottomButton from "@/_common/BottomButton";
import Loading from "@/_common/Loading";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";

interface AlcoholTypeResponse {
  id: number;
  name: string;
  image: string;
}

interface IUnOfficialBasicInformationForm {
  handleStep: () => void;
}

export default function UnOfficialBasicInformationForm({
  handleStep,
}: IUnOfficialBasicInformationForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const { alcoholTypeId } = tastingNoteInformationStore;
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      alcoholicDrinksName: "",
      alcoholContent: "",
      alcoholTypeName: "",
      alcoholTypeId: 0,
      breweryName: "",
    },
  });
  const [formAlcoholTypeId, setFormAlcoholTypeId] = useState(alcoholTypeId);
  const formAlcoholicDrinksName = watch("alcoholicDrinksName");
  const formAlcoholContent = watch("alcoholContent");
  const formAlcoholTypeName = watch("alcoholTypeName");
  const formBreweryName = watch("breweryName");
  const enableButton = !!(
    formAlcoholicDrinksName &&
    formAlcoholContent &&
    formAlcoholTypeName &&
    isValid
  );

  const { data: alcoholType, isFetching: isLoadingAlcoholType } = useQuery({
    queryKey: ["alcoholType"],
    queryFn: getAlcoholType,
  });

  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");
  const { tastingNoteRequest } = useTastingNoteStore();

  // URL에 /edit이 포함된 경우 초기값 설정 및 비활성화
  useEffect(() => {
    if (isEditMode && tastingNoteRequest) {
      const { alcoholicDrinksDetails, alcoholTypeId } =
        tastingNoteRequest.request;
      setValue(
        "alcoholicDrinksName",
        alcoholicDrinksDetails.alcoholicDrinksName,
      );
      setValue(
        "alcoholContent",
        alcoholicDrinksDetails.alcoholContent.toString(),
      );
      setValue("alcoholTypeName", alcoholicDrinksDetails.alcoholTypeName);
      setFormAlcoholTypeId(alcoholTypeId);
    }
  }, [pathname, setValue, tastingNoteRequest]);

  const validateAlcoholContent = (value: string | number) => {
    const stringValue = String(value);
    const regex = /^(0|[1-9]\d*)(\.\d{1})?$/;
    return regex.test(stringValue);
  };

  const handleAlcoholTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAlcoholType = alcoholType.alcoholTypeInfos?.find(
      (alcohol: AlcoholTypeResponse) => alcohol.name === event.target.value,
    );
    if (selectedAlcoholType) {
      setFormAlcoholTypeId(selectedAlcoholType.id);
      setValue("alcoholTypeName", selectedAlcoholType.name);
    }
  };

  const saveBasicInformation = () => {
    tastingNoteInformationStore.setAlcoholicDrinksName(formAlcoholicDrinksName);
    tastingNoteInformationStore.setAlcoholContent(Number(formAlcoholContent));
    tastingNoteInformationStore.setAlcoholTypeName(formAlcoholTypeName);
    tastingNoteInformationStore.setAlcoholTypeId(formAlcoholTypeId);
    tastingNoteInformationStore.setBreweryName(
      formBreweryName ? formBreweryName : "",
    );
  };
  const handleNextButton = () => {
    saveBasicInformation();
    handleStep();
  };

  // if (isLoadingAlcoholType) return <Loading />;
  return (
    <div className="mx-[18px] mt-6 flex flex-col gap-y-10 pb-[102px]">
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
            htmlFor="alcoholicDrinksName"
            className="text-base font-bold text-cool-grayscale-800"
          >
            제품명
          </label>
          <input
            className={clsx(
              "mt-[1%] h-11 w-full rounded-[6px] border-[1px] border-cool-grayscale-300 px-[10px] py-4",
              {
                "bg-cool-grayscale-100 text-cool-grayscale-400": isEditMode, // 비활성화 시 흐릿한 스타일
              },
            )}
            placeholder="전통주의 이름을 띄어쓰기 없이 입력해주세요."
            {...register("alcoholicDrinksName")}
            onInput={(event: FormEvent<HTMLInputElement>) => {
              const value = event.currentTarget.value;
              event.currentTarget.value = value.replace(/\s+/g, "");
            }}
            disabled={isEditMode}
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
              {...register("alcoholTypeName", {
                required: "주종을 선택하여 주세요",
              })}
              className="h-full w-full appearance-none rounded-[6px] bg-cool-grayscale-50 px-[4%]"
              defaultValue="" // 기본값 설정
              onChange={handleAlcoholTypeChange}
            >
              <option value="" disabled hidden>
                주종을 선택하여 주세요
              </option>
              {alcoholType?.alcoholTypeInfos?.map(
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
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/down_arrow.svg`}
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
            {...register("breweryName")}
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
    </div>
  );
}
