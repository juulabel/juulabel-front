"use client";

import BottomButton from "@/_common/BottomButton";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";

interface IOfficialBasicInformationForm {
  productName: string;
  alcoholContent: string;
  alcoholType: string;
  brewery?: string;
  breweryLocation?: string;
  handleStep: () => void;
}

export default function OfficialBasicInformationForm({
  productName,
  alcoholContent,
  alcoholType,
  brewery,
  breweryLocation,
  handleStep,
}: IOfficialBasicInformationForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();

  const handleNextButton = () => {
    tastingNoteInformationStore.setProductName(productName);
    tastingNoteInformationStore.setAlcoholContent(alcoholContent);
    tastingNoteInformationStore.setAlcoholType(alcoholType);
    tastingNoteInformationStore.setBrewery(brewery ? brewery : "");
    tastingNoteInformationStore.setBreweryLocation(
      breweryLocation ? breweryLocation : "",
    );
    //다음 단계로 이동
    handleStep();
  };
  return (
    <>
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
              {alcoholType}
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
    </>
  );
}
