import { useState } from "react";

interface IScentForm {
  handleStep: () => void;
}

export default function ScentForm({ handleStep }: IScentForm) {
  const [productName, setProductName] = useState("탁100 내추럴");

  return (
    <>
      {/* 타이틀 */}
      <div className="mx-[4%] mt-6">
        <p className="text-xl font-bold text-cool-grayscale-800">
          <span className="text-primary-700">{productName}</span>의 향은
          어떤가요?
        </p>
      </div>
      {/* 본문: 입력 항목들 */}
      <div className="mx-[4%] mt-[4.5vh] flex flex-col">
        <span className="text-base font-bold text-cool-grayscale-800">
          자연
        </span>
        <span className="ml-[3%] text-sm font-normal text-cool-grayscale-500">
          전통주의 색은 어떤가요?
        </span>
      </div>
    </>
  );
}
