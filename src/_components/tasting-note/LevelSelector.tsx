import { usePathname } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface ILevel {
  id: number;
  score: number;
  description: string;
}

interface ILevelSelector {
  levels: ILevel[];
  setSelectedIds: Dispatch<SetStateAction<number[]>>;
  showDescriptions?: boolean;
  defaultSelectedId?: number;
}

export default function LevelSelector({
  levels,
  setSelectedIds,
  showDescriptions = false,
  defaultSelectedId,
}: ILevelSelector) {
  const initialSelectedId = defaultSelectedId ?? levels[0].id;
  const [selectedId, setSelectedId] = useState<number>(initialSelectedId);
  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");
  useEffect(() => {
    // 초기 마운트 시 levels에 있는 모든 값을 제거하고 initialSelectedId만 추가
    setSelectedIds((prev) => {
      const filteredIds = prev.filter(
        (id) => !levels.some((level) => level.id === id),
      );

      return [...filteredIds, initialSelectedId];
    });
  }, [initialSelectedId, levels, setSelectedIds]);

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);
      const newSelectedId = levels[value].id;
      console.log(
        "이건가? : " + newSelectedId + ":" + levels[value].description,
      );
      //selectedId 는 선택된게 있는지 체크함
      setTimeout(() => {
        setSelectedId((prev) => {
          // 기존에 선택했던 값을 배열에서 제거하고 새로 선택한 값을 추가
          setSelectedIds((prevIds) => {
            const updatedIds = prevIds.filter((id) => id !== prev); // 이전 값 제거
            return updatedIds.includes(newSelectedId)
              ? updatedIds
              : [...updatedIds, newSelectedId]; // 새로운 값 추가
          });
          return newSelectedId;
        });
      }, 0);
    },
    [levels, setSelectedIds],
  );

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative w-full">
        <input
          type="range"
          min="0"
          max={levels.length - 1}
          step="1"
          value={levels.findIndex((level) => level.id === selectedId)}
          onChange={handleSliderChange}
          className="relative z-10 h-3 w-full cursor-pointer appearance-none rounded-lg focus:outline-none"
          style={{
            background: `linear-gradient(
                    to right,
                    #475569 0%,
                    #475569 ${(levels.findIndex((level) => level.id === selectedId) / (levels.length - 1)) * 100}%,
                    #E2E8F0 ${(levels.findIndex((level) => level.id === selectedId) / (levels.length - 1)) * 100}%,
                    #E2E8F0 100%
                  )`,
          }}
        />

        {/* Level dots - overlay on top of the slider */}
        <div className="pointer-events-none absolute top-1/2 z-20 flex w-full -translate-y-1/2 justify-between px-4">
          {levels.map((level, index) => (
            <div
              key={level.id}
              className={`z-0 h-[6px] w-[9px] rounded-full ${
                index === levels.findIndex((l) => l.id === selectedId)
                  ? "opacity-0"
                  : index < levels.findIndex((l) => l.id === selectedId)
                    ? "bg-slate-500"
                    : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 슬라이더 아래의 description 레이블 */}
      {showDescriptions && (
        <div className="mt-3 flex w-full justify-between px-2">
          {levels.map((level) => (
            <span key={level.id} className="text-sm text-cool-grayscale-500">
              {level.description}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
