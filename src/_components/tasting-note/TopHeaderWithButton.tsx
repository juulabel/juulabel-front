import { cn } from "@/_utils/commons";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { RxDotsHorizontal } from "react-icons/rx";

interface ITopHeaderWithButton {
  title: string;
  buttonType: "menu" | "text";
  buttonName?: string;
  isActiveButton?: boolean;
  onClickBackButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickButton?: (event: React.MouseEvent) => void;
  haveSteps: boolean;
  currentStep?: number;
  remainStep?: number;
}

export default function TopHeaderWithButton({
  title,
  buttonType,
  buttonName,
  isActiveButton = false, // 디폴트 비활성화
  onClickBackButton,
  onClickButton,
  haveSteps = false,
  currentStep = 0,
  remainStep = 5,
}: ITopHeaderWithButton) {
  const router = useRouter();
  const totalSteps = currentStep + remainStep;
  const handleBackButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClickBackButton) {
      event.preventDefault();
      onClickBackButton(event);
    } else {
      router.back(); // onClick이 없을 때만 router.back() 호출
    }
  };
  const renderRightButton = () => {
    switch (buttonType) {
      case "text":
        return (
          <div
            className={`${cn("absolute right-4 p-1 font-medium text-primary-300", isActiveButton && "cursor-pointer text-primary-700")}`}
            onClick={onClickButton}
          >
            {buttonName}
          </div>
        );
      case "menu":
        return (
          <RxDotsHorizontal
            className="absolute right-4 p-1 text-cool-grayscale-800"
            size={24}
            onClick={onClickButton}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="fixed top-0 w-full max-w-[560px] bg-white">
      <div className="relative flex h-16 flex-row items-center justify-center p-4">
        {/* 뒤로가기 버튼 */}
        <button onClick={handleBackButton} className="absolute left-4 p-1">
          <GoChevronLeft size={24} className="text-cool-grayscale-500" />
        </button>

        <div className="text-lg font-bold text-cool-grayscale-700">{title}</div>

        {/* 오른쪽 버튼 */}
        {renderRightButton()}
      </div>

      {/* 시음노트 작성단계 진행 표시 바 */}
      {haveSteps && (
        <div className="flex">
          <div
            className="h-1 bg-primary-700"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
          <div
            className="h-1 bg-primary-300"
            style={{ width: `${(remainStep / totalSteps) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
