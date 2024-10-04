import BottomButton from "@/_common/BottomButton";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { useState } from "react";

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
  scents: string[];
  selectedScents: string[];
  onSelectScent: (scent: string) => void;
}

function ScentCategory({
  title,
  scents,
  selectedScents,
  onSelectScent,
}: IScentCategory) {
  return (
    <div>
      <span className="text-base font-bold text-cool-grayscale-800">
        {title}
      </span>
      <div className="mt-[8px] flex flex-wrap justify-start gap-[6px]">
        {scents.map((scent) => (
          <ScentChip
            key={scent}
            name={scent}
            selected={selectedScents.includes(scent)}
            onSelect={() => onSelectScent(scent)}
          />
        ))}
      </div>
    </div>
  );
}

interface IScentForm {
  handleStep: () => void;
}

export default function ScentForm({ handleStep }: IScentForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const [productName, setProductName] = useState("탁100 내추럴");
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const isButtonEnabled = selectedScents.length > 0;

  const handleNextButton = () => {
    // localStorage에 선택된 향들 저장
    tastingNoteInformationStore.setScents(selectedScents);
    handleStep(); // 다음 단계로 이동
  };

  const scentCategories = [
    { name: "자연", scents: ["꽃", "허브", "풀/나무", "흙", "스모크"] },
    {
      name: "과일/채소",
      scents: [
        "사과",
        "귤/오렌지",
        "레몬/라임",
        "딸기",
        "복숭아",
        "체리",
        "메론",
        "망고",
        "참외",
      ],
    },
    {
      name: "곡류",
      scents: ["보리", "밀", "생쌀", "옥수수", "갓지은밥", "엿길금"],
    },
    {
      name: "향신료, 기타",
      scents: [
        "향신료",
        "계피",
        "꿀",
        "팔각",
        "누룩향",
        "버터",
        "바닐라",
        "초콜릿",
      ],
    },
  ];

  // 향 Chip을 선택했을 때 호출되는 함수
  const onSelectScent = (scent: string) => {
    setSelectedScents((prev) => {
      if (prev.includes(scent)) {
        // 이미 선택된 향이라면 제거
        return prev.filter((s) => s !== scent);
      } else if (prev.length < 3) {
        // 3개 미만인 경우 추가
        return [...prev, scent];
      }
      return prev;
    });
  };

  return (
    <>
      {/* 타이틀 */}
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{productName}</span>의 향은
          어떤가요?
        </p>
        <p className="text-sm font-normal text-cool-grayscale-500">
          3개까지 선택 가능해요
        </p>
      </div>
      {/* 본문: 입력 항목들 */}
      <div className="flex flex-col gap-y-8">
        {scentCategories.map((category) => (
          <ScentCategory
            key={category.name}
            title={category.name}
            scents={category.scents}
            selectedScents={selectedScents}
            onSelectScent={onSelectScent}
          />
        ))}
      </div>
      <BottomButton enableButton={isButtonEnabled} onClick={handleNextButton}>
        다음
      </BottomButton>
    </>
  );
}
