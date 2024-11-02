import BottomButton from "@/_common/BottomButton";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { getScents } from "@/app/api/tasting-note/getTastingNoteFormInformation";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface IScentChip {
  name: string;
  selected: boolean;
  onSelect: () => void;
}

function ScentChip({ name, selected, onSelect }: IScentChip) {
  return (
    <div
      onClick={onSelect}
      className={`w-max cursor-pointer rounded-full border-[1px] border-cool-grayscale-300 px-[12px] py-[6px] ${selected ? "border-cool-grayscale-700 bg-cool-grayscale-700 text-white" : ""} `}
    >
      <span className="text-sm">{name}</span>
    </div>
  );
}

interface IScentCategory {
  title: string;
  scents: IScent[];
  selectedScentIds: number[];
  onSelectScentChip: (scentId: number) => void;
}

function ScentCategory({
  title,
  scents,
  selectedScentIds,
  onSelectScentChip,
}: IScentCategory) {
  return (
    <div>
      <span className="text-base font-bold text-cool-grayscale-800">
        {title}
      </span>
      <div className="mt-[8px] flex flex-wrap justify-start gap-[6px]">
        {scents.map((scent) => (
          <ScentChip
            key={scent.id}
            name={scent.name}
            selected={selectedScentIds.includes(scent.id)}
            onSelect={() => onSelectScentChip(scent.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface IScentForm {
  handleStep: () => void;
}

interface IScent {
  id: number;
  name: string;
}

interface ICategoryResponse {
  id: number;
  code: string;
  name: string;
  scents: IScent[];
}

export default function ScentForm({ handleStep }: IScentForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const {
    alcoholicDrinksDetails: { alcoholicDrinksName },
    alcoholTypeId,
  } = tastingNoteInformationStore;
  const [selectedScentIds, setSelectedScentIds] = useState<number[]>([]);
  const isButtonEnabled = selectedScentIds.length > 0;

  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");
  const { tastingNoteRequest } = useTastingNoteStore();

  // 향 정보 조회
  const { data: scents } = useQuery<ICategoryResponse[]>({
    queryKey: ["tastingNoteScents", alcoholTypeId],
    queryFn: () => getScents(alcoholTypeId),
  });

  // editMode일 때 초기 scent selection 설정
  useEffect(() => {
    if (isEditMode && tastingNoteRequest) {
      setSelectedScentIds(tastingNoteRequest.request.scentIds);
    }
  }, [isEditMode, tastingNoteRequest]);

  const handleNextButton = () => {
    // localStorage에 선택된 향들 저장
    tastingNoteInformationStore.setScentIds(selectedScentIds);
    handleStep(); // 다음 단계로 이동
  };

  // 향 Chip을 선택했을 때 호출되는 함수
  const onSelectScentChip = (scentId: number) => {
    setSelectedScentIds((prev) => {
      if (prev.includes(scentId)) {
        // 이미 선택된 향이라면 제거
        return prev.filter((s) => s !== scentId);
      } else if (prev.length < 3) {
        // 3개 미만인 경우 추가
        return [...prev, scentId];
      }
      return prev;
    });
  };

  return (
    <div className="mx-[18px] mt-6 flex flex-col gap-y-10 pb-[102px]">
      {/* 타이틀 */}
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{alcoholicDrinksName}</span>의 향은
          어떤가요?
        </p>
        <p className="text-sm font-normal text-cool-grayscale-500">
          3개까지 선택 가능해요
        </p>
      </div>
      {/* 본문: 입력 항목들 */}
      <div className="flex flex-col gap-y-8">
        {scents &&
          scents.map((category) => (
            <ScentCategory
              key={category.name}
              title={category.name}
              scents={category.scents}
              selectedScentIds={selectedScentIds}
              onSelectScentChip={onSelectScentChip}
            />
          ))}
      </div>
      <BottomButton enableButton={isButtonEnabled} onClick={handleNextButton}>
        다음
      </BottomButton>
    </div>
  );
}
