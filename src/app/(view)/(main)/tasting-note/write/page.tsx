"use client";

import React, { Suspense, useState } from "react";
import TopHeader from "@/_common/TopHeader";
import OfficialBasicInformationForm from "@/_components/tasting-note/OfficialBasicInformationForm";
import UnOfficialBasicInformationForm from "@/_components/tasting-note/UnOfficialBasicInformationForm";
import { useSearchParams } from "next/navigation";
import Loading from "@/_common/Loading";

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
      <div className="mx-[4%] mt-6">
        <p className="text-xl font-bold text-cool-grayscale-800">
          전통주 기본 정보
        </p>
        <p className="text-sm font-medium text-cool-grayscale-500">
          기록하실 전통주의 기본 정보를 입력해주세요.
        </p>
      </div>
      {step === 1 && productName ? (
        <OfficialBasicInformationForm
          productName={productName}
          alcoholContent={alcoholContent}
          alcoholType={alcoholType}
          brewery={brewery}
          breweryLocation={breweryLocation}
        />
      ) : (
        <UnOfficialBasicInformationForm handleStep={handleStep} />
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
