import BottomButton from "@/_common/BottomButton";
import { getFlavors } from "@/app/api/tasting-note/getTastingNoteFormInformation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTastingNoteInformationStore } from "../../_store/tastingNote";
import RadarChart from "./HexagonChart";

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

interface IFlavorSelector {
  flavorInfo: FlavorInfo;
  levels: Level[];
  onChange: () => void;
}

function FlavorSelector({ flavorInfo, levels, onChange }: IFlavorSelector) {
  return (
    <div className="flex flex-row">
      <label className="text-base font-bold">{flavorInfo.name}</label>
    </div>
  );
}

interface IFlavorForm {
  handleStep: () => void;
}

export default function FlavorForm({ handleStep }: IFlavorForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const {
    alcoholicDrinksDetails: { alcoholicDrinksName },
    alcoholTypeId,
  } = tastingNoteInformationStore;

  const [flavorScores, setFlavorScores] = useState<FlavorScore[]>([]);

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

  useEffect(() => {
    console.log("flavorLevels", flavorLevels);
  }, [flavorLevels]);

  const handleNextButton = () => {
    // localStorage에 맛 저장
    handleStep(); // 다음 단계로 이동
  };

  return (
    <div className="mx-[18px] mt-6 flex flex-col gap-y-10 pb-[102px]">
      {/* 타이틀 */}
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{alcoholicDrinksName}</span>의 맛은
          어떤가요?
        </p>
      </div>
      <div className="flex justify-center">
        <RadarChart dataPoints={flavorChartData} />
      </div>
      <div className="flex flex-col gap-y-6">
        {/* 맛의 정도 선택 */}
        {flavorLevels?.map((flavorLevel) => (
          <FlavorSelector
            flavorInfo={flavorLevel.flavor}
            levels={flavorLevel.levels}
            onChange={() => {}}
          />
        ))}
      </div>
      <BottomButton enableButton={true} onClick={handleNextButton}>
        다음
      </BottomButton>
    </div>
  );
}
