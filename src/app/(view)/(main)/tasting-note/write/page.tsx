"use client";

import Loading from "@/_common/Loading";
import TopHeader from "@/_common/TopHeader";
import CommonInformationForm from "@/_components/tasting-note/CommonInformationForm";
import OfficialBasicInformationForm from "@/_components/tasting-note/OfficialBasicInformationForm";
import UnOfficialBasicInformationForm from "@/_components/tasting-note/UnOfficialBasicInformationForm";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function WriteTastingNote() {
  const searchParams = useSearchParams();
  const productName = searchParams.get("productName") ?? "";
  const alcoholContent = searchParams.get("alcoholContent") ?? "";
  const alcoholType = searchParams.get("alcoholType") ?? "";
  const brewery = searchParams.get("brewery") ?? "";
  const breweryLocation = searchParams.get("breweryLocation") ?? "";

  const [step, setStep] = useState<number>(1);
  const [rest, setRest] = useState<number>(4);

  const handleStep = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
      setRest((prev) => prev - 1);
    }
  };
  return (
    <div className="h-full w-full max-w-[560px]">
      <TopHeader title="전통주 기본 정보" step={step} rest={rest} />
      {step === 1 && productName ? (
        <OfficialBasicInformationForm
          productName={productName}
          alcoholContent={alcoholContent}
          alcoholType={alcoholType}
          brewery={brewery}
          breweryLocation={breweryLocation}
          handleStep={handleStep}
        />
      ) : step === 1 ? (
        <UnOfficialBasicInformationForm handleStep={handleStep} />
      ) : (
        <CommonInformationForm handleStep={handleStep} />
      )}
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
