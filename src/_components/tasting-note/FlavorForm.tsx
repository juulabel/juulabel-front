import BottomButton from "@/_common/BottomButton";
import { useState } from "react";
import { useTastingNoteInformationStore } from "../../_store/tastingNote";
import RadarChart from "./HexagonChart";

interface IFlavorForm {
  handleStep: () => void;
}

export default function FlavorForm({ handleStep }: IFlavorForm) {
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const [productName, setProductName] = useState("탁100 내추럴");
  const [sweetness, setSweetness] = useState(1);
  const [acidity, setAcidity] = useState(1);
  const [bitterness, setBitterness] = useState(1);
  const [umami, setUmami] = useState(1);
  const [aftertaste, setAftertaste] = useState(1);
  const [body, setBody] = useState(1);
  const flavorData = [sweetness, acidity, bitterness, umami, aftertaste, body];

  const handleNextButton = () => {
    // localStorage에 맛 저장
    handleStep(); // 다음 단계로 이동
  };

  return (
    <>
      {/* 타이틀 */}
      <div>
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{productName}</span>의 맛은
          어떤가요?
        </p>
      </div>
      <div className="flex justify-center">
        <RadarChart data={flavorData} />
      </div>
      <BottomButton enableButton={true} onClick={handleNextButton}>
        다음
      </BottomButton>
    </>
  );
}
