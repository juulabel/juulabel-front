import { ILevel, ISensoryLevelInfo } from "@/_types";
import LevelSelector from "./LevelSelector";
import { Dispatch, SetStateAction } from "react";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import SensoryLevelSelector from "./SensoryLevelSelector";

interface Props {
  sensoryLevelInfo: ISensoryLevelInfo;
  setSelectedSensoryIds: Dispatch<SetStateAction<number[]>>;
  isEditMode: boolean;
  sensoryIndex: number;
}

export default function SensoryInfo({
  sensoryLevelInfo,
  setSelectedSensoryIds,
  isEditMode,
  sensoryIndex,
}: Props) {
  const { tastingNoteRequest } = useTastingNoteStore();
  const {
    alcoholicDrinksDetails: { alcoholicDrinksName },
    alcoholTypeId,
  } = useTastingNoteInformationStore();

  // Function to match sensory levels with initial IDs in edit mode
  function getInitialSensoryLevelId(levels: ILevel[]) {
    if (
      isEditMode &&
      tastingNoteRequest &&
      tastingNoteRequest.request.alcoholTypeId === alcoholTypeId
    ) {
      const sensoryLevelIdsSet = new Set(
        tastingNoteRequest.request.sensoryLevelIds,
      );

      const matchingLevel = levels.find((level) =>
        sensoryLevelIdsSet.has(level.id),
      );

      //   console.log("levels: " + JSON.stringify(levels, null, 2));

      // const matchingLevel =
      //   tastingNoteRequest.request.sensoryLevelIds[sensoryIndex];

      return matchingLevel?.id;
    }
    return undefined;
  }

  return (
    <div className="mt-8" key={sensoryLevelInfo.sensory.id}>
      {/* 타이틀 */}
      <div className="mb-[20px]">
        <span className="text-base font-bold text-cool-grayscale-800">
          {sensoryLevelInfo.sensory.name}
        </span>
        <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
          {sensoryLevelInfo.sensory.description}
        </span>
      </div>
      {/* 텍스처 평가 슬라이더 부분 */}
      {/* <LevelSelector
        levels={sensoryLevelInfo.levels}
        setSelectedIds={setSelectedSensoryIds}
        showDescriptions={true}
        defaultSelectedId={getInitialSensoryLevelId(sensoryLevelInfo.levels)}
      /> */}
      {/* tastingNoteRequest.request.sensoryLevelIds[sensoryIndex] */}
      <SensoryLevelSelector
        setSelectedSensoryIds={setSelectedSensoryIds}
        levels={sensoryLevelInfo.levels}
        selectedSensoryId={getInitialSensoryLevelId(sensoryLevelInfo.levels)}
      />
    </div>
  );
}
