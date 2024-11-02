import BottomButton from "@/_common/BottomButton";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { getFlavors } from "@/app/api/tasting-note/getTastingNoteFormInformation";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTastingNoteInformationStore } from "../../_store/tastingNote";
import RadarChart from "./HexagonChart";
import LevelSelector from "./LevelSelector";

interface FlavorInfo {
  id: number;
  name: string;
}

interface Level {
  id: number;
  score: number;
  description: string;
}

interface FlavorLevelInfo {
  flavor: FlavorInfo;
  levels: Level[];
}

interface FlavorScore {
  flavorId: number;
  flavorName: string;
  score: number;
}

interface IFlavorForm {
  handleStep: () => void;
}

export default function FlavorForm({ handleStep }: IFlavorForm) {
  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");
  const { tastingNoteRequest } = useTastingNoteStore();
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const {
    alcoholicDrinksDetails: { alcoholicDrinksName },
    alcoholTypeId,
  } = tastingNoteInformationStore;

  const [flavorScores, setFlavorScores] = useState<FlavorScore[]>([]);
  const [selectedFlavorIds, setSelectedFlavorIds] = useState<number[]>([]);

  // 맛 데이터 포인트 생성
  const flavorChartData = flavorScores.map(({ flavorName, score }) => ({
    label: flavorName,
    data: score,
  }));

  const { data: flavorLevels } = useQuery<FlavorLevelInfo[]>({
    queryKey: ["tastingNoteFlavors", alcoholTypeId],
    queryFn: () => getFlavors(alcoholTypeId),
  });

  // flavorLevels를 기반으로 flavorScores 초기화
  useEffect(() => {
    if (flavorLevels) {
      const initialScores = flavorLevels.map((flavorLevel) => ({
        flavorId: flavorLevel.flavor.id,
        flavorName: flavorLevel.flavor.name,
        score: 0,
      }));
      setFlavorScores(initialScores);
    }
  }, [flavorLevels]);

  // `selectedFlavorIds` 변화에 따라 `flavorScores`를 `flavorLevels`을 참고하여 업데이트
  useEffect(() => {
    if (flavorLevels) {
      setFlavorScores((prevScores) =>
        prevScores.map((score) => {
          const matchingLevel = flavorLevels
            .find((flavorLevel) => flavorLevel.flavor.id === score.flavorId)
            ?.levels.find((level) => selectedFlavorIds.includes(level.id));

          return matchingLevel
            ? { ...score, score: matchingLevel.score }
            : score;
        }),
      );
    }
  }, [selectedFlavorIds, flavorLevels]);

  const handleNextButton = () => {
    // localStorage에 맛 저장
    tastingNoteInformationStore.setFlavorLevelIds(selectedFlavorIds);
    handleStep(); // 다음 단계로 이동
  };

  // Get default level ID based on edit mode data
  const getInitialLevelId = (levels: Level[]) => {
    if (isEditMode && tastingNoteRequest) {
      const matchingLevel = levels.find((level) =>
        tastingNoteRequest.request.flavorLevelIds.includes(level.id),
      );
      return matchingLevel ? matchingLevel.id : undefined;
    }
    return undefined;
  };

  return (
    <div className="mx-[18px] mt-6 flex flex-col pb-[102px]">
      {/* 타이틀 */}
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{alcoholicDrinksName}</span>의 맛은
          어떤가요?
        </p>
      </div>
      <div className="mt-[20px] flex justify-center">
        <RadarChart dataPoints={flavorChartData} />
      </div>
      {/* 맛의 정도 선택 */}
      <div className="mt-7 grid grid-cols-[auto,1fr] gap-x-[14px] gap-y-6">
        <div />
        <div className="flex justify-between px-2">
          <span className="text-cool-grayscale-500">낮음</span>
          <span className="text-cool-grayscale-500">높음</span>
        </div>
        {flavorLevels?.map((flavorLevel) => (
          <React.Fragment key={flavorLevel.flavor.id}>
            <label className="text-base font-bold">
              {flavorLevel.flavor.name}
            </label>
            <LevelSelector
              levels={flavorLevel.levels}
              setSelectedIds={setSelectedFlavorIds}
              defaultSelectedId={getInitialLevelId(flavorLevel.levels)}
            />
          </React.Fragment>
        ))}
      </div>
      <BottomButton enableButton={true} onClick={handleNextButton}>
        다음
      </BottomButton>
    </div>
  );
}
