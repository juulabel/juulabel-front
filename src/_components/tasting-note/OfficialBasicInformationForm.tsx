"use client";

import BottomButton from "@/_common/BottomButton";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { usePathname } from "next/navigation";

interface IOfficialBasicInformationForm {
  alcoholicDrinksId: string;
  productName: string;
  alcoholContent: string;
  alcoholTypeId: string;
  alcoholTypeName: string;
  brewery?: string;
  breweryLocation?: string;
  handleStep: () => void;
}

export default function OfficialBasicInformationForm({
  alcoholicDrinksId,
  productName,
  alcoholContent,
  alcoholTypeId,
  alcoholTypeName,
  brewery,
  breweryLocation,
  handleStep,
}: IOfficialBasicInformationForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const { tastingNoteRequest } = useTastingNoteStore();
  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");

  const handleNextButton = () => {
    tastingNoteInformationStore.setAlcoholicDrinksId(Number(alcoholicDrinksId));
    tastingNoteInformationStore.setAlcoholicDrinksName(productName);
    tastingNoteInformationStore.setAlcoholContent(parseFloat(alcoholContent));
    tastingNoteInformationStore.setAlcoholTypeId(Number(alcoholTypeId));
    tastingNoteInformationStore.setAlcoholTypeName(alcoholTypeName);
    tastingNoteInformationStore.setBreweryName(brewery ? brewery : "");
    tastingNoteInformationStore.setBreweryRegion(
      breweryLocation ? breweryLocation : "",
    );
    //다음 단계로 이동
    handleStep();
  };

  return (
    <div className="mx-[18px] mt-6 flex flex-col gap-y-10 pb-[102px]">
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          전통주 기본 정보
        </p>
        <p className="text-sm font-medium text-cool-grayscale-500">
          전통주의 기본 정보가 자동 입력되었어요.
        </p>
      </div>
      <div>
        <div>
          <div className="my-[2%] flex items-center justify-between">
            <p className="text-base font-normal text-cool-grayscale-500">
              제품명
            </p>
            <p className="text-base font-medium text-cool-grayscale-700">
              {productName}
            </p>
          </div>
          <div className="my-[2%] flex items-center justify-between">
            <p className="text-base font-normal text-cool-grayscale-500">
              도수
            </p>
            <p className="text-base font-medium text-cool-grayscale-700">
              {alcoholContent}%
            </p>
          </div>
          <div className="my-[2%] flex items-center justify-between">
            <p className="text-base font-normal text-cool-grayscale-500">
              주종
            </p>
            <p className="text-base font-medium text-cool-grayscale-700">
              {alcoholTypeName}
            </p>
          </div>
          <div className="my-[2%] flex items-center justify-between">
            <p className="text-base font-normal text-cool-grayscale-500">
              양조장
            </p>
            <p className="text-base font-medium text-cool-grayscale-700">
              {brewery}
            </p>
          </div>
          <div className="my-[2%] flex items-center justify-between">
            <p className="text-base font-normal text-cool-grayscale-500">
              지역
            </p>
            <p className="text-base font-medium text-cool-grayscale-700">
              {breweryLocation}
            </p>
          </div>
        </div>
        <BottomButton enableButton={true} onClick={handleNextButton}>
          다음
        </BottomButton>
      </div>
    </div>
  );
}
