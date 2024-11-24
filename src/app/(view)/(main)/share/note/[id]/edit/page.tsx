"use client";

import Loading from "@/_common/Loading";
import TopHeader from "@/_common/TopHeader";
import CommentAndRatingForm from "@/_components/tasting-note/CommentAndRatingForm";
import FlavorForm from "@/_components/tasting-note/FlavorForm";
import OfficialBasicInformationForm from "@/_components/tasting-note/OfficialBasicInformationForm";
import ScentForm from "@/_components/tasting-note/ScentForm";
import UnOfficialBasicInformationForm from "@/_components/tasting-note/UnOfficialBasicInformationForm";
import VisualAndTextureForm from "@/_components/tasting-note/VisualAndTextureForm";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { ITastingNoteWriteRequest } from "@/_types";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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
  const alcoholicDrinksId = searchParams.get("alcoholicDrinksId") ?? "";
  const productName = searchParams.get("productName") ?? "";
  const alcoholContent = searchParams.get("alcoholContent") ?? "";
  const alcoholTypeId = searchParams.get("alcoholTypeId") ?? "";
  const alcoholTypeName = searchParams.get("alcoholTypeName") ?? "";
  const brewery = searchParams.get("brewery") ?? "";
  const breweryLocation = searchParams.get("breweryLocation") ?? "";

  const { setTastingNoteRequest } = useTastingNoteStore();
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

  useEffect(() => {
    if (data && alcoholTypeData) {
      // `alcoholTypeData`에서 `alcoholTypeName`과 일치하는 `id`를 찾음
      const matchedType = alcoholTypeData.find(
        (type: IAlcoholType) =>
          type.name === data.tastingNoteDetailInfo.alcoholTypeName,
      );

      const processedData: ITastingNoteWriteRequest = {
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
      setTastingNoteRequest({ request: processedData, files: [] });
    }
  }, [data, alcoholTypeData]);

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
            title="시음노트 수정하기"
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
