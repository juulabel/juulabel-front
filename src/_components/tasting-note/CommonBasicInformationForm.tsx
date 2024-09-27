"use client";

import BottomButton from "@/_common/BottomButton";
import Checkbox from "@/_common/Checkbox";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { cn } from "@/_utils/commons";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

interface ICommonInformationForm {
  handleStep: () => void;
}

const CheckIcon = () => {
  return (
    <div className="m-[3px] flex h-[18px] w-[18px] items-center justify-center rounded bg-cool-grayscale-900 text-xs text-white">
      <FaCheck />
    </div>
  );
};

export default function CommonBasicInformationForm({
  handleStep,
}: ICommonInformationForm) {
  const [productName, setProductName] = useState("탁100 내추럴");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [tmpSelectedColor, setTmpSelectedColor] = useState<string | undefined>(
    undefined,
  ); // selectedColor 값과 분리하여 바텀시트에서 선택했을 때 UI를 바로 업데이트하지 않기 위한 변수
  const [checkedNoColor, setCheckedNoColor] = useState(false); // '찾는색이없어요' 체크 여부
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const [enableButton, setEnableButton] = useState(false); // '다음' 버튼 활성화 여부
  const [enableCheckConfirmButton, setEnableCheckConfirmButton] =
    useState(false); // 바텀시트의 '선택완료' 버튼 활성화 여부
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const mainColorCodes = [
    "#FFFFFF",
    "#EFEFE8",
    "#EEE8DE",
    "#EFE1C7",
    "#EBD8A6",
  ];
  const additionalColorCodes = ["#E5E5E9", "#F0A8A4", "#EB6A63"];

  useEffect(() => {
    // 사용자가 색상 또는 '찾는색이없어요'를 선택한 경우 '다음' 버튼 활성화
    if (selectedColor !== undefined) setEnableButton(true);
  }, [selectedColor]);

  // 메인 색상을 선택했을 때 호출되는 함수
  const handleColorClick = (colorCode: string) => {
    setSelectedColor(colorCode);
    setCheckedNoColor(false);
    setTmpSelectedColor(undefined);
  };

  // 바텀시트의 기타 색상을 선택했을 때 호출되는 함수
  const handleAdditionalColorClick = (colorCode: string) => {
    setTmpSelectedColor(colorCode); // 임시색상값 업데이트
    setCheckedNoColor(false); // '찾는색이없어요' 체크 해제
    setEnableCheckConfirmButton(true); // '선택완료' 버튼 활성화
  };

  // 바텀시트의 '찾는색이없어요' 체크박스를 선택했을 때 호출되는 함수
  const handleCheckboxChange = () => {
    const newCheckedState = !checkedNoColor; // 현재 체크박스 상태
    setTmpSelectedColor(newCheckedState ? "찾는색이없어요" : undefined); // 임시색상값 업데이트
    setCheckedNoColor(newCheckedState);
    setEnableCheckConfirmButton(newCheckedState);
    setEnableButton(newCheckedState);
  };
  const handleShowBottomSheet = () => {
    setShowBottomSheet(true);
  };

  // 바텀시트의 '선택완료' 버튼을 선택했을 때 호출되는 함수
  const handleCheckConfirmButton = () => {
    setSelectedColor(tmpSelectedColor); // 임시 값을 UI에 반영함
    setShowBottomSheet(false); // 바텀 시트 닫기
  };

  // 선택한 색상을 로컬스토리지에 저장하는 함수
  const saveInformation = () => {
    if (selectedColor !== undefined) {
      tastingNoteInformationStore.setRgbColor(selectedColor);
    }
  };
  const handleNextBotton = () => {
    saveInformation();
  };

  return (
    <>
      {/* 타이틀 */}
      <div className="mx-[4%] mt-6">
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{productName}</span>은 어떤가요?
        </p>
      </div>
      <div className="mx-[4%] mt-[4.5vh] flex flex-col">
        {/* 전통주 색상 */}
        <div className="">
          <span className="text-base font-bold text-cool-grayscale-800">
            술 색
          </span>
          <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
            전통주의 색은 어떤가요?
          </span>
          <div className="mt-3 grid w-full grid-cols-5 gap-2">
            {/* 색상 버튼 */}
            {mainColorCodes.map((colorCode, index) => (
              <button
                key={index}
                className={cn(
                  "h-10 rounded px-1",
                  colorCode === "#FFFFFF" && "border",
                )}
                style={{ backgroundColor: colorCode }}
                onClick={() => handleColorClick(colorCode)}
              >
                {selectedColor === colorCode && <CheckIcon />}
              </button>
            ))}
            <button
              className={cn(
                "flex h-10 w-full items-center justify-start rounded px-1",
                selectedColor && additionalColorCodes.includes(selectedColor)
                  ? ""
                  : "border",
              )}
              style={{
                backgroundColor:
                  selectedColor && additionalColorCodes.includes(selectedColor)
                    ? selectedColor
                    : "transparent",
              }}
              onClick={handleShowBottomSheet}
            >
              {selectedColor === "찾는색이없어요" ? (
                // '찾는 색이 없어요'를 선택한 경우
                <>
                  <CheckIcon />
                  <span className="ml-[7px] text-xs text-cool-grayscale-500">
                    기타
                  </span>
                </>
              ) : selectedColor &&
                additionalColorCodes.includes(selectedColor) ? (
                // 기타 색상을 선택한 경우
                <div>
                  <CheckIcon />
                </div>
              ) : (
                // 바텀 시트에서 아무것도 선택하지 않은 경우 (초기 상태)
                <span className="w-full text-xs text-cool-grayscale-500">
                  기타 색
                </span>
              )}
            </button>
          </div>
        </div>
        {/* 전통주 탁도 */}
        <div className="mt-6">
          <span className="text-base font-bold text-cool-grayscale-800">
            탁도
          </span>
          <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
            술이 얼마나 탁한가요?
          </span>
        </div>
        {/* 전통주 탄산도 */}
        <div className="mt-6">
          <span className="text-base font-bold text-cool-grayscale-800">
            탄산도
          </span>
          <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
            술의 탄산이 얼마나 느껴지나요?
          </span>
        </div>
        {/* 전통주 점성도 */}
        <div className="mt-6">
          <span className="text-base font-bold text-cool-grayscale-800">
            점성도
          </span>
          <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
            술의 점성도가 어느정도 되나요?
          </span>
        </div>

        <BottomButton enableButton={enableButton} onClick={handleNextBotton}>
          다음
        </BottomButton>
      </div>

      {/* 기타 색상 고르는 바텀 시트 */}
      {showBottomSheet && (
        <>
          {/* backdrop */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-20 h-full w-full transition duration-200 ease-out",
              showBottomSheet && "pointer-events-auto bg-black bg-opacity-60",
            )}
            onClick={() => setShowBottomSheet((prev) => !prev)}
          />

          {/* botton sheet */}
          <div className="pointer-events-none fixed bottom-0 z-20 flex w-full max-w-[560px] flex-col items-end justify-end space-y-4">
            <div
              className={cn(
                "pointer-events-auto relative flex h-[294px] w-full flex-col rounded-t-xl bg-white px-4 pt-[18px] opacity-0 transition-opacity duration-200 ease-out",
                showBottomSheet && "opacity-100",
              )}
            >
              <img
                className="absolute right-4 top-4 h-8 w-8 cursor-pointer"
                src="/svg/close_icon.svg"
                alt="취소 아이콘"
                onClick={() => setShowBottomSheet((prev) => !prev)}
              />
              <div className="text-xl font-bold text-cool-grayscale-800">
                기타 색상을 선택해주세요.
              </div>
              <div className="mt-6 grid w-full grid-cols-3 gap-2">
                {/* 색상 버튼 */}
                {additionalColorCodes.map((colorCode, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-10 rounded px-2",
                      colorCode === "#FFFFFF" && "border",
                    )}
                    style={{ backgroundColor: colorCode }}
                    onClick={() => handleAdditionalColorClick(colorCode)}
                  >
                    {tmpSelectedColor === colorCode && <CheckIcon />}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-row items-center">
                <Checkbox
                  checked={checkedNoColor}
                  onChange={handleCheckboxChange}
                />
                <div>찾는 색이 없어요.</div>
              </div>
              <BottomButton
                enableButton={enableCheckConfirmButton}
                onClick={handleCheckConfirmButton}
              >
                선택완료
              </BottomButton>
            </div>
          </div>
        </>
      )}
    </>
  );
}
