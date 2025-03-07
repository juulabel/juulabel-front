"use client";

import Loading from "@/_common/Loading";
import TopHeader from "@/_common/TopHeader";
import ShareWriteTopHeader from "@/_components/share/ShareWriteTopHeader";
import CommentAndRatingForm from "@/_components/tasting-note/CommentAndRatingForm";
import FlavorForm from "@/_components/tasting-note/FlavorForm";
import OfficialBasicInformationForm from "@/_components/tasting-note/OfficialBasicInformationForm";
import ScentForm from "@/_components/tasting-note/ScentForm";
import UnOfficialBasicInformationForm from "@/_components/tasting-note/UnOfficialBasicInformationForm";
import VisualAndTextureForm from "@/_components/tasting-note/VisualAndTextureForm";
import { cn } from "@/_utils/commons";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function WriteTastingNote() {
  const searchParams = useSearchParams();
  const formRef = useRef<{ submitForm: () => void }>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (step < 5) {
      setStep((prev) => prev + 1);
      setRest((prev) => prev - 1);
    }
  };

  // step을 1 감소시키는 함수
  const handleStepBack = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (1 < step) {
      setStep((prev) => prev - 1);
      setRest((prev) => prev + 1);
    }
  };

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const renderHeaderComponent = () => {
    return (
      <ShareWriteTopHeader
        title="시음노트 작성하기"
        onSubmit={handleButtonClick}
        step={step}
        rest={rest}
        onClick={step === 1 ? undefined : handleStepBack}
      />
    );
  };

  const renderStepComponent = () => {
    return (
      <div
        className="min-h-full overflow-hidden transition-all duration-700"
        style={{ maxHeight: `${containerHeight}px` }}
      >
        <div
          className="flex transition-transform duration-700 ease-in"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          <div
            className={cn(
              "w-full flex-shrink-0 transition-all duration-700 ease-in-out",
              {
                "scale-80 blur-sm": step !== 1,
                "scale-100 blur-0": step === 1,
              },
            )}
          >
            <div
              ref={(el) => {
                stepRefs.current[0] = el;
              }}
            >
              {productName ? (
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
              )}
            </div>
          </div>

          {[
            <VisualAndTextureForm handleStep={handleStepNext} key="visual" />,
            <ScentForm handleStep={handleStepNext} key="scent" />,
            <FlavorForm handleStep={handleStepNext} key="flavor" />,
            <CommentAndRatingForm
              ref={formRef}
              handleStepBack={handleStepBack}
              key="comment"
            />,
          ].map((Component, index) => (
            <div
              key={index}
              className={cn(
                "duration-800 w-full flex-shrink-0 transition-all ease-in-out",
                {
                  "scale-60 blur-30": step !== index + 2,
                  "scale-100 blur-0": step === index + 2,
                },
              )}
            >
              <div
                ref={(el) => {
                  stepRefs.current[index + 1] = el;
                }}
              >
                {Component}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    let timeoutId: number;

    if (stepRefs.current[step - 1]) {
      const currentHeight = stepRefs.current[step - 1]?.scrollHeight ?? 0;

      // 애니메이션 효과 시간 떄ㅑ문에 이렇게함
      timeoutId = window.setTimeout(() => {
        setContainerHeight(currentHeight);
      }, 700);
    }

    // 클린업 함수로 타임아웃 정리
    return () => clearTimeout(timeoutId);
  }, [step]);

  return (
    <div
      ref={topRef}
      className={cn(
        "h-full w-full max-w-[560px] overflow-x-hidden pt-16 scrollbar-hide",
        {},
      )}
    >
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
