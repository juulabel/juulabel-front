"use client";

import Loading from "@/_common/Loading";
import TopHeader from "@/_common/TopHeader";
import CommentAndRatingForm from "@/_components/tasting-note/CommentAndRatingForm";
import FlavorForm from "@/_components/tasting-note/FlavorForm";
import OfficialBasicInformationForm from "@/_components/tasting-note/OfficialBasicInformationForm";
import ScentForm from "@/_components/tasting-note/ScentForm";
import UnOfficialBasicInformationForm from "@/_components/tasting-note/UnOfficialBasicInformationForm";
import VisualAndTextureForm from "@/_components/tasting-note/VisualAndTextureForm";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function WriteTastingNote() {
  const searchParams = useSearchParams();
  const alcoholicDrinksId = searchParams.get("alcoholicDrinksId") ?? "";
  const productName = searchParams.get("productName") ?? "";
  const alcoholContent = searchParams.get("alcoholContent") ?? "";
  const alcoholTypeId = searchParams.get("alcoholTypeId") ?? "";
  const alcoholTypeName = searchParams.get("alcoholTypeName") ?? "";
  const brewery = searchParams.get("brewery") ?? "";
  const breweryLocation = searchParams.get("breweryLocation") ?? "";

  const [step, setStep] = useState<number>(1);
  const [rest, setRest] = useState<number>(4);

  //  step을 1 증가시키는 함수
  const handleStepNext = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
      setRest((prev) => prev - 1);
    }
  };

  // step을 1 감소시키는 함수
  const handleStepBack = () => {
    if (1 < step) {
      setStep((prev) => prev - 1);
      setRest((prev) => prev + 1);
    }
  };

  const renderHeaderComponent = () => {
    switch (step) {
      case 5:
        return null;
      default:
        return (
          <TopHeader
            title="시음노트 작성하기"
            step={step}
            rest={rest}
            onClick={step === 1 ? undefined : handleStepBack}
          />
        );
    }
  };

  // step 값에 따라 입력 폼 컴포넌트 분기 처리
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return productName ? (
          <OfficialBasicInformationForm
            alcoholicDrinksId={alcoholicDrinksId}
            productName={productName}
            alcoholContent={alcoholContent}
            alcoholTypeId={alcoholTypeId}
            alcoholTypeName={alcoholTypeName}
            brewery={brewery}
            breweryLocation={breweryLocation}
            handleStep={handleStepNext}
          />
        ) : (
          <UnOfficialBasicInformationForm handleStep={handleStepNext} />
        );
      case 2:
        return <VisualAndTextureForm handleStep={handleStepNext} />;
      case 3:
        return <ScentForm handleStep={handleStepNext} />;
      case 4:
        return <FlavorForm handleStep={handleStepNext} />;
      case 5:
        return <CommentAndRatingForm handleStepBack={handleStepBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full max-w-[560px]">
      {renderHeaderComponent()}
      {renderStepComponent()}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <WriteTastingNote />
    </Suspense>
  );
}
