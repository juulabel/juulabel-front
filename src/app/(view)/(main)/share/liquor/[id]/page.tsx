import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { fetchLiquor } from "@/app/api/getTraditioanlLiquorList";
import getTraditionalLiquor from "@/app/api/tasting-note/getTraditionalLiquor";
import Separator from "@/_components/share/Separator";
import MoonRating from "@/_components/share/detail/MoonRating";
import ShareAboutAlcoholReview from "@/_components/share/detail/ShareAboutAlcoholReview";
import ShareAboutTheSmellOfAlcohol from "@/_components/share/detail/ShareAboutTheSmellOfAlcohol";
import ShareTraditionalLiquor from "@/_components/share/detail/ShareTraditionalLiquor";
import TraditionalLiquorBackground from "@/_components/share/detail/TraditionalLiquorBackground";
import TraditionalLiquorCapacityCell from "@/_components/share/detail/TraditionalLiquorCapacityCell";
import TraditionalLiquorDetailPrice from "@/_components/share/detail/TraditionalLiquorDetailPrice";
import ServerToast from "@/_components/share/error/ServerToast";
import RadarChart from "@/_components/tasting-note/write/HexagonChart";
import { DrinkApiResponse } from "@/_types/tasting-note/drink";
import { SearchParamProps } from "@/_types";
import ClientRadarChart from "./_component/ClientRadarChart";
import FilteringRouteButton from "./_component/FilteringRouteButton";
import ImageRouteBackButton from "./_component/ImageRouteBackButton";

export async function generateStaticParams() {
  const { result } = await fetchLiquor();
  return result.alcoholicDrinks.map((drink) => ({
    id: drink.id.toString(),
  }));
}

export default async function LiquorDetailPage({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);
  const mediumTextStyle = "text-[16px] font-normal text-cool-grayscale-700";

  const data = await getTraditionalLiquor({
    alcoholicDrinksId: numberTypeId,
  });

  if (!numberTypeId || isNaN(numberTypeId)) {
    return <ServerToast text="잘못된 접근입니다." redirectPath="/share/note" />;
  }
  return (
    <section className="relative h-screen w-full max-w-[560px] overflow-y-auto overflow-x-hidden">
      <div className="relative h-[216px] w-full">
        <TraditionalLiquorBackground />
        <ImageRouteBackButton />

        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <p className="bg-transparent text-[18px] text-white">
            전통주 상세 소개
          </p>
        </div>
      </div>

      <div className="absolute top-[150px] flex min-h-[80%] w-full flex-col items-center rounded-t-[24px] border bg-white px-4">
        <div className="flex w-full flex-row items-center justify-between gap-4 px-1">
          <div className="grid grid-cols-[3fr_1fr_3fr] items-center gap-1 gap-y-2 px-2 py-4">
            <div className="col-span-3 text-start text-[18px] font-bold text-cool-grayscale-800">
              {data?.result.alcoholicDrinksDetailInfo.name}
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>주종</div>
            <div className="flex h-full items-center justify-center border-cool-grayscale-300">
              <div className="h-[8px] border-l border-cool-grayscale-300"></div>
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>
              {data?.result.alcoholicDrinksDetailInfo?.alcoholType?.name}
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>용량</div>
            <div className="flex h-full items-center justify-center border-cool-grayscale-300">
              <div className="h-[8px] border-l border-cool-grayscale-300"></div>
            </div>
            <TraditionalLiquorCapacityCell
              alcoholicVolume={
                String(
                  data?.result?.alcoholicDrinksDetailInfo.alcoholicVolume,
                ) || "0"
              }
              mediumTextStyle={mediumTextStyle}
            />
            <div className={clsx("text-start", mediumTextStyle)}>알코울</div>
            <div className="flex h-full items-center justify-center border-cool-grayscale-300">
              <div className="h-[8px] border-l border-cool-grayscale-300"></div>
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>
              {data?.result.alcoholicDrinksDetailInfo.alcoholContent || 10.5}%
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>양조장</div>
            <div className="flex h-full items-center justify-center border-cool-grayscale-300">
              <div className="h-[8px] border-l border-cool-grayscale-300"></div>
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>
              {data?.result.alcoholicDrinksDetailInfo?.brewery?.name}
            </div>
            <div className={clsx("text-start", mediumTextStyle)}>가격</div>
            <div className="flex h-full items-center justify-center border-cool-grayscale-300">
              <div className="h-[8px] border-l border-cool-grayscale-300"></div>
            </div>
            <TraditionalLiquorDetailPrice
              regularPrice={
                data?.result.alcoholicDrinksDetailInfo?.regularPrice || 0
              }
            />
          </div>
          <div className="relative z-20 h-[187px] w-[140px] overflow-hidden rounded-[8px]">
            <Image
              src={data?.result.alcoholicDrinksDetailInfo.thumbnail || ""}
              fill
              className="object-cover"
              alt="Landscape"
              priority
            />
          </div>
        </div>

        <Gap />
        <div className="flex w-full flex-col">
          <div className="flex flex-row gap-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/location.svg`}
              width={16}
              height={16}
              alt="location"
            />
            <span className="text-[16px] text-cool-grayscale-500">지역</span>
          </div>

          <div className="text-[16px] font-semibold text-cool-grayscale-700">
            {data?.result.alcoholicDrinksDetailInfo?.brewery?.region}
          </div>
        </div>
        <Gap />
        <div className="flex w-full flex-col">
          <div className="flex flex-row gap-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/raw_materials.svg`}
              width={16}
              height={16}
              alt="raw meterials"
            />
            <span className="text-[16px] text-cool-grayscale-500">원재료</span>
          </div>

          <div className="flex flex-row items-center gap-2 text-cool-grayscale-700">
            {data?.result.ingredientSummary?.map((ingredient, index) => {
              return (
                <Fragment key={"liquor" + index}>
                  <span className="text-[16px] font-semibold">
                    {ingredient.name}
                  </span>
                  {data?.result.ingredientSummary.length - 1 !== index && (
                    <Separator />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex h-fit min-h-[91px] w-full flex-col items-center justify-center gap-2 rounded-[8px] bg-cool-grayscale-100 px-3 py-3">
          <span className="text-[14px] font-bold text-cool-grayscale-800">
            "양조장 대표님의 한마디"
          </span>
          <span className="text-[14px] text-cool-grayscale-600">
            {data?.result.alcoholicDrinksDetailInfo?.brewery.message ||
              "아직 준비중이에요!"}
          </span>
        </div>
        <MiddleLine />
        <div className="mb-4 w-full text-[18px] font-bold text-cool-grayscale-800">
          전통주 상세정보
        </div>
        <div className="flex w-full flex-col">
          <div className="mb-1 text-[16px] font-normal text-cool-grayscale-600">
            평균 달점
          </div>
          <div className="mb-2 flex w-full flex-row justify-between">
            <div className="text-[18px] font-normal text-cool-grayscale-500">
              <span className="font-bold text-primary-700">
                {data?.result.alcoholicDrinksDetailInfo?.rating.toFixed(1) ||
                  (0.0).toFixed(1)}
              </span>
              /5
            </div>
            <MoonRating
              rating={data?.result.alcoholicDrinksDetailInfo?.rating || 0}
            />
          </div>
        </div>
        <Gap />
        <div className="w-full">
          <div className="space-y-1">
            <div className="text-[16px] font-semibold text-cool-grayscale-600">
              술 향
            </div>

            <div className="flex w-fit flex-shrink-0 items-center gap-2">
              {data?.result?.tastingNoteSensorSummary?.scent?.map(
                (text, index) => {
                  return (
                    <Fragment key={index + "key"}>
                      <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
                        {text}
                      </span>
                      {data?.result?.tastingNoteSensorSummary?.scent?.length -
                        1 !==
                        index && <Separator className="mx-auto" />}
                    </Fragment>
                  );
                },
              )}
            </div>
          </div>
        </div>
        <Gap />

        <div className="w-full">
          <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
            술 맛 그래프
          </span>

          <div className="mt-4 flex w-full justify-center">
            <ClientRadarChart
              flavor={data?.result?.tastingNoteSensorSummary?.flavor}
            />
          </div>
        </div>

        <Gap />

        <div className="w-full">
          <div className="mb-4 w-full text-[16px] font-bold text-cool-grayscale-800">
            주라벨이 추천하는 페어링
          </div>

          <div className="gap mb-5 flex flex-row"></div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div></div>

          <article className="flex min-h-[119px] w-full flex-col gap-2 rounded-[8px] bg-cool-grayscale-50 px-2 py-3">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 pt-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/food_search_icon.svg`}
                width={30}
                height={28}
                alt="icon"
              />
              <div className="flex flex-col items-center text-[14px] text-cool-grayscale-600">
                <span>잘 맞는 페어링 음식을 찾고 있어요.</span>
                <span>조금만 기다려 주세요!</span>
              </div>
            </div>
          </article>
        </div>

        <FilteringRouteButton id={numberTypeId} />
      </div>
    </section>
  );
}
function MiddleLine() {
  return (
    <div className="my-5 h-2 w-screen max-w-[560px] bg-cool-grayscale-100"></div>
  );
}
function Gap() {
  return <div className="my-3 h-[1px] w-full bg-cool-grayscale-100" />;
}
