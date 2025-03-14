import BottomButton from "@/_common/BottomButton";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { cn } from "@/_utils/commons";
import {
  getColors,
  getSensories,
} from "@/app/api/tasting-note/getTastingNoteFormInformation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import LevelSelector from "./LevelSelector";
import { ISensoryLevelInfo } from "@/_types";
import SensoryInfo from "./SensoryInfo";

interface ColorInfo {
  id: number;
  name: string;
  rgb: string;
}

interface IVisualAndTextureForm {
  handleStep: () => void;
}

interface ICheckIcon {
  hasState?: boolean;
  isActive?: boolean;
  handleCheck?: () => void;
}
const CheckIcon = ({
  hasState = false,
  isActive = false,
  handleCheck,
}: ICheckIcon) => {
  return (
    <div
      className={cn(
        "m-[3px] flex h-[18px] w-[18px] items-center justify-center rounded text-xs text-white",
        !hasState
          ? "bg-cool-grayscale-900"
          : isActive
            ? "bg-primary-700"
            : "bg-cool-grayscale-300",
      )}
      onClick={handleCheck}
    >
      <FaCheck />
    </div>
  );
};

interface ISensoryInfo {
  id: number;
  name: string;
  description: string;
}

export default function VisualAndTextureForm({
  handleStep,
}: IVisualAndTextureForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const {
    alcoholicDrinksDetails: { alcoholicDrinksName },
    alcoholTypeId,
  } = tastingNoteInformationStore;
  const [mainColors, setMainColors] = useState<ColorInfo[]>([]); // 메인에 나와있는 색상들
  const [additionalColors, setAdditionalColors] = useState<ColorInfo[]>([]); // 바텀시트에 있는 색상들

  const [selectedColor, setSelectedColor] = useState(0); // 선택한 색상 id 값
  const [tmpSelectedColor, setTmpSelectedColor] = useState(0); // selectedColor 값과 분리하여 바텀시트에서 선택했을 때 UI를 바로 업데이트하지 않기 위한 변수
  const [checkedNoColor, setCheckedNoColor] = useState(false); // '찾는 색이 없어요' 체크박스 체크 여부
  const [enableButton, setEnableButton] = useState(false); // '다음' 버튼 활성화 여부
  const [enableCheckConfirmButton, setEnableCheckConfirmButton] =
    useState(false); // 바텀시트의 '선택완료' 버튼 활성화 여부
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedSensoryIds, setSelectedSensoryIds] = useState<number[]>([]); // 선택된 촉각 정보

  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");
  const { tastingNoteRequest } = useTastingNoteStore();

  // 술 색 정보 조회
  const { data: colors } = useQuery({
    queryKey: ["tastingNoteColors", alcoholTypeId],
    queryFn: () => getColors(alcoholTypeId),
  });

  // 미각(텍스처) 정보 조회
  const { data: sensoryLevelInfos } = useQuery<ISensoryLevelInfo[]>({
    queryKey: ["tastingNoteSensories", alcoholTypeId],
    queryFn: () => getSensories(alcoholTypeId),
  });

  useEffect(() => {}, [sensoryLevelInfos, colors]);
  // editMode일 때 store에서 colorId와 sensoryLevelIds 불러와 초기값으로 설정
  useEffect(() => {
    if (isEditMode && tastingNoteRequest && colors) {
      if (tastingNoteRequest?.request.alcoholTypeId !== alcoholTypeId) {
        setSelectedSensoryIds([]);
      } else {
        const colorRGB = tastingNoteRequest.request.colorId.toString();
        const matchedColor = colors.find(
          (color: ColorInfo) => color.rgb === colorRGB,
        );
        if (matchedColor) {
          setSelectedColor(matchedColor.id);
        }
        setSelectedSensoryIds(tastingNoteRequest.request.sensoryLevelIds);
      }
    }
  }, [isEditMode, tastingNoteRequest, colors]);

  // 다음버튼 활성화
  useEffect(() => {
    if (selectedColor !== 0 || checkedNoColor) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  }, [selectedColor, checkedNoColor]);

  // 바텀시트 선택완료 버튼 활성화
  useEffect(() => {
    if (tmpSelectedColor !== 0 || checkedNoColor) {
      // 기타색상을 선택 또는 찾는색이없어요 체크 된 상태라면 무조건 바텀시트 버튼 활성화
      setEnableCheckConfirmButton(true);
    } else {
      setEnableCheckConfirmButton(false);
    }
  }, [tmpSelectedColor, checkedNoColor]);

  // 메인 & 기타 색 할당
  useEffect(() => {
    if (colors && colors.length >= 6) {
      setMainColors(colors.slice(0, 5));
      setAdditionalColors(colors.slice(5));
    } else if (colors) {
      setMainColors(colors);
      setAdditionalColors([]);
    }
  }, [colors]);

  // 메인색상 선택 시 호출되는 함수
  const handleColorClick = (colorId: number) => {
    setSelectedColor(colorId);
    setTmpSelectedColor(0); // 기타색상 선택 해제
    setCheckedNoColor(false); //체크박스 해제
  };

  // 바텀시트의 '선택완료' 버튼을 선택했을 때 호출되는 함수
  const handleCheckConfirmButton = () => {
    setSelectedColor(tmpSelectedColor); // 임시 값을 UI에 반영함
    setShowBottomSheet(false); // 바텀 시트 닫기
  };

  // 다음 버튼 클릭 시 동작하는 함수
  const handleNextBotton = () => {
    // 색상id값 로컬스토리지에 저장
    tastingNoteInformationStore.setColorId(selectedColor);
    tastingNoteInformationStore.setSensoryLevelIds(selectedSensoryIds);

    // 다음 단계로 이동
    handleStep();
  };

  // '기타 색' 버튼 렌더
  const renderExtraButton = () => {
    if (additionalColors.length <= 0) return null;
    // 술 색 6개 이상인 경우에만 버튼 렌더
    return (
      <button
        className="flex h-10 w-full items-center justify-start rounded border border-cool-grayscale-300 px-1"
        style={{
          backgroundColor: (() => {
            const color = additionalColors.find(
              (color) => color.id === selectedColor,
            );
            return color ? color.rgb : "transparent";
          })(),
        }}
        onClick={handleShowBottomSheet}
      >
        {checkedNoColor ? (
          <>
            <CheckIcon />
            <span className="ml-[7px] text-xs text-cool-grayscale-500">
              기타
            </span>
          </>
        ) : selectedColor &&
          additionalColors.some((color) => color.id === selectedColor) ? (
          <div>
            <CheckIcon />
          </div>
        ) : (
          <span className="w-full text-xs text-cool-grayscale-500">
            기타 색
          </span>
        )}
      </button>
    );
  };

  const handleShowBottomSheet = () => {
    setShowBottomSheet(true);
  };

  // 바텀시트의 기타 색상을 선택했을 때 호출되는 함수
  const handleAdditionalColorClick = (colorId: number) => {
    setTmpSelectedColor(colorId); // 임시색상값 업데이트
    setCheckedNoColor(false); // 체크박스 해제
  };

  // 찾는 색이 없어요 클릭 시 동작하는 함수
  const handleCheck = () => {
    const newState = !checkedNoColor;
    setCheckedNoColor(newState);
    if (newState) setTmpSelectedColor(0); // 기타색상 선택 해제

    // 찾는색이없어요 체크박스가 메인에 나와있는 경우, 즉시 selectedColor에 반영
    if (additionalColors.length <= 0) {
      setSelectedColor(0);
    }
  };

  return (
    <div className="mx-[18px] mt-6 flex flex-col gap-y-10 pb-[102px]">
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{alcoholicDrinksName}</span>은
          어떤가요?
        </p>
      </div>
      {/* 본문: 입력 항목들 */}
      <div>
        {/* 전통주 색상 선택 */}
        <div>
          <span className="text-base font-bold text-cool-grayscale-800">
            술 색
          </span>
          <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
            전통주의 색은 어떤가요?
          </span>
          <div className="mt-3 grid w-full grid-cols-5 gap-2">
            {/* 색상 버튼 */}
            {mainColors.length > 0 &&
              mainColors.map((color) => (
                <button
                  key={color.id}
                  className={cn(
                    "h-10 rounded px-1",
                    color.rgb === "#FFFFFF" && "border", // 흰색일 때 border 추가
                  )}
                  style={{ backgroundColor: color.rgb }}
                  onClick={() => handleColorClick(color.id)}
                >
                  {selectedColor === color.id && <CheckIcon />}
                </button>
              ))}
            {/* 색상이 6개 이상인 경우에만 '기타 색' 버튼을 표시함 */}
            {renderExtraButton()}
          </div>
          {additionalColors.length <= 0 && (
            <div className="mt-2 flex flex-row items-center py-1">
              <CheckIcon
                hasState={true}
                isActive={checkedNoColor}
                handleCheck={handleCheck}
              />
              <div className="ml-1 text-sm text-cool-grayscale-800">
                찾는 색이 없어요.
              </div>
            </div>
          )}
        </div>
        {/* 전통주 텍스처 선택 */}
        {sensoryLevelInfos &&
          sensoryLevelInfos.map((sensoryLevelInfo, index) => (
            <SensoryInfo
              key={sensoryLevelInfo.levels[0].id}
              sensoryLevelInfo={sensoryLevelInfo}
              setSelectedSensoryIds={setSelectedSensoryIds}
              isEditMode={isEditMode}
              sensoryIndex={index}
            />
          ))}
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

          {/* bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-30">
            <div className="pointer-events-none absolute bottom-0 left-1/2 flex w-screen max-w-[560px] -translate-x-1/2 transform flex-col items-end justify-end space-y-4">
              <div
                className={cn(
                  "pointer-events-auto relative flex h-[294px] w-full flex-col rounded-t-xl bg-white px-4 pt-[18px] opacity-0 transition-opacity duration-200 ease-out",
                  showBottomSheet && "opacity-100",
                )}
              >
                <Image
                  width={32}
                  height={32}
                  className="absolute right-4 top-4 cursor-pointer"
                  src="/app/svg/close_icon.svg"
                  alt="취소 아이콘"
                  onClick={() => setShowBottomSheet((prev) => !prev)}
                />
                <div className="text-xl font-bold text-cool-grayscale-800">
                  기타 색상을 선택해주세요.
                </div>
                <div className="mt-6 grid w-full grid-cols-3 gap-2">
                  {/* 색상 버튼 */}
                  {additionalColors.map((color) => (
                    <button
                      key={color.id}
                      className={cn(
                        "h-10 rounded px-2",
                        color.rgb === "#FFFFFF" && "border",
                      )}
                      style={{ backgroundColor: color.rgb }}
                      onClick={() => handleAdditionalColorClick(color.id)}
                    >
                      {tmpSelectedColor === color.id && <CheckIcon />}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-row items-center">
                  <CheckIcon
                    hasState={true}
                    isActive={checkedNoColor}
                    handleCheck={handleCheck}
                  />
                  <div className="ml-1">찾는 색이 없어요.</div>
                </div>
                <BottomButton
                  enableButton={enableCheckConfirmButton}
                  onClick={handleCheckConfirmButton}
                >
                  선택완료
                </BottomButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
