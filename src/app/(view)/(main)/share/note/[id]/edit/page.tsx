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
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { ITastingNoteWriteRequest } from "@/_types";
import { cn } from "@/_utils/commons";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

interface IAlcoholType {
  id: number;
  name: string;
  image: string | null;
}

interface IEditTastingNote {
  id: number;
}

function EditTastingNote({ id }: IEditTastingNote) {
  const searchParams = useSearchParams();

  const formRef = useRef<{ submitForm: () => void }>(null);

  const alcoholicDrinksId = searchParams.get("alcoholicDrinksId") ?? "";
  const productName = searchParams.get("productName") ?? "";
  const alcoholContent = searchParams.get("alcoholContent") ?? "";
  const alcoholTypeId = searchParams.get("alcoholTypeId") ?? "";
  const alcoholTypeName = searchParams.get("alcoholTypeName") ?? "";
  const brewery = searchParams.get("brewery") ?? "";
  const breweryLocation = searchParams.get("breweryLocation") ?? "";

  const { setTastingNoteRequest, setImageUrlList } = useTastingNoteStore();
  const [cookies] = useCookies(["accessToken"]);

  const { data } = useQuery({
    queryKey: ["noteDetail", id],
    queryFn: () =>
      getNoteDetail({
        token: cookies.accessToken,
        id: id,
      }),
    select: (data) => data.result,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    // enabled: !cookies.accessToken,
  });

  const { data: alcoholTypeData } = useQuery({
    queryKey: ["alcoholType"],
    queryFn: getAlcoholType,
    select: (data) => data.alcoholTypeInfos,
  });
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (data && alcoholTypeData) {
      // `alcoholTypeData`에서 `alcoholTypeName`과 일치하는 `id`를 찾음
      const matchedType = alcoholTypeData.find(
        (type: IAlcoholType) =>
          type.name === data.tastingNoteDetailInfo.alcoholTypeName,
      );

      const requestData: ITastingNoteWriteRequest = {
        alcoholicDrinksDetails: {
          alcoholicDrinksName: data.tastingNoteDetailInfo.alcoholicDrinksName,
          alcoholContent: data.tastingNoteDetailInfo.alcoholContent,
          alcoholTypeName: data.tastingNoteDetailInfo.alcoholTypeName,
          breweryName: data.tastingNoteDetailInfo.breweryName,
          breweryRegion: "",
        },
        alcoholTypeId: matchedType ? matchedType.id : 0,
        alcoholicDrinksId: data.tastingNoteDetailInfo.tastingNoteId,
        colorId: data.tastingNoteDetailInfo.rgbColor,
        scentIds: data.scentIds,
        sensoryLevelIds: data.sensoryLevelIds,
        flavorLevelIds: data.flavorLevelIds,
        content: data.tastingNoteDetailInfo.content,
        isPrivate: false,
        rating: data.tastingNoteDetailInfo.rating,
      };

      const imageUrlList = data.imageInfo.imageUrlList || [];
      setImageUrlList(imageUrlList);

      setTastingNoteRequest({ request: requestData, files: [] });
    }
  }, [data, alcoholTypeData, setImageUrlList, setTastingNoteRequest]);

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
  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };
  const renderHeaderComponent = () => {
    return (
      <ShareWriteTopHeader
        title="시음노트 수정하기"
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
    <div className="h-full w-full max-w-[560px] pt-16">
      {renderHeaderComponent()}
      {renderStepComponent()}
    </div>
  );
}

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <EditTastingNote id={Number(params.id)} />
    </Suspense>
  );
}
