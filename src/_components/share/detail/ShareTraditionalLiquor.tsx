"use client";

import React, { Fragment, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import RadarChart from "@/_components/tasting-note/HexagonChart";
import ShareAboutTheSmellOfAlcohol from "./ShareAboutTheSmellOfAlcohol";
import ShareAboutAlcoholReview from "./ShareAboutAlcoholReview";
import MoonRating from "./MoonRating";
import Separator from "../Separator";
import { useQuery } from "@tanstack/react-query";
import getTraditionalLiquor from "@/app/api/tasting-note/getTraditionalLiquor";
import { mapImageUrl, parseNumberOfDefault } from "@/_utils/commons";
import { IApiResponse } from "@/_types";
import { IResponseTranditionalLiquor } from "@/_types/tasting-note/officialData";
import { useRouter } from "next/navigation";
import ShareTraditionalLiquorSkeletonUI from "./ShareTraditionalLiquorSkeletonUI";
import TraditionalLiquorCapacityCell from "@/_components/share/detail/TraditionalLiquorCapacityCell";
import useVolumePriceStore from "@/_store/volumePriceStore";
import TraditionalLiquorDetailPrice from "@/_components/share/detail/TraditionalLiquorDetailPrice";
import useTraditionalLiquorList from "@/_utils/hooks/useTraditionalLiquorList";
import TraditionalLiquorBackground from "@/_components/share/detail/TraditionalLiquorBackground";
import ServerToast from "../error/ServerToast";

interface Props {
  id: number;
}

export default function ShareTraditionalLiquor({ id }: Props) {
  const mediumTextStyle = "text-[16px] font-normal text-cool-grayscale-700";

  const router = useRouter();
  const { data, isFetching, isError, isFetched } = useTraditionalLiquorList(id);

  useEffect(() => {
    // const sensoryIds = data?.result.tastingNoteSensorSummary.sensory.map(
    //   (sensory) => {
    //     return sensory.id;
    //   },
    // );
  }, [isFetching]);

  if (isFetching) {
    return <ShareTraditionalLiquorSkeletonUI />;
  }

  if (isError) {
    return (
      <ServerToast
        text="데이터를 불러오는 중 에러가 발생했습니다."
        redirectPath="/share/note"
      />
    );
  }
  return (
    <>
      <div className="relative h-[216px] w-full">
        <TraditionalLiquorBackground />

        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/left_arrow_white.svg`}
          width={28}
          height={28}
          alt="<"
          className="absolute left-5 top-1/3 z-10 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />

        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <p className="bg-transparent text-[18px] text-white">
            전통주 상세 소개
          </p>
        </div>
      </div>

      {/* Overlay Content */}
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
        {/* <ShareAboutAlcoholReview
          sensoryLevelIds={
            data?.result.tastingNoteSensorSummary?.sensory?.map(
              (sensory) => sensory.id,
            ) ?? []
          }
          alcoholColor={data?.result.tastingNoteSensorSummary.rgb || "#FFF"}
        /> */}
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

        {/* 이 그래프 컴포넌트부분은 클라이언트 컴포넌트로 따로 분리예정 */}
        <div className="w-full">
          <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
            술 맛 그래프
          </span>

          <div className="mt-4 flex w-full justify-center">
            <RadarChart
              dataPoints={
                data?.result?.tastingNoteSensorSummary?.flavor?.map(
                  ({ name, score }) => ({
                    data: score,
                    label: name,
                  }),
                ) || []
              }
            />
          </div>
        </div>

        <Gap />

        <div className="w-full">
          <div className="mb-4 w-full text-[16px] font-bold text-cool-grayscale-800">
            주라벨이 추천하는 페어링
          </div>

          <div className="gap mb-5 flex flex-row">
            {/* <div className="flex flex-col justify-center gap-2">
              <div className="relative z-20 h-[40px] w-[40px] overflow-hidden rounded-full">
                <Image
                  src="https://picsum.photos/id/238/200/300"
                  fill
                  className="object-cover"
                  alt="Landscape"
                />
              </div>
              <div>전골류</div>
            </div> */}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div>
            {/* <div className="w-full text-[16px] font-bold text-cool-grayscale-800">
              마셔본 사람들은 이렇게 느껴요
            </div>
            <div className="text-[14px] text-cool-grayscale-500">
              시음노트 <strong>312개</strong> 중 좋요아를 많이 받은
              시음노트에요.
            </div> */}
          </div>

          <article className="flex min-h-[119px] w-full flex-col gap-2 rounded-[8px] bg-cool-grayscale-50 px-2 py-3">
            {/* 
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <div className="relative z-20 h-[24px] w-[24px] overflow-hidden rounded-full">
                  <Image
                    src="https://picsum.photos/id/238/200/300"
                    fill
                    className="object-cover"
                    alt="Landscape"
                  />
                </div>
                <span className="text-[14px] font-normal text-cool-grayscale-700">
                  김이동인뎁쇼
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Image
                  src={"/svg/like_full.svg"}
                  width={16}
                  height={16}
                  alt="좋아요"
                />
                <div className="text-[14px] font-normal text-cool-grayscale-600">
                  <strong>25명</strong>이 좋아해요
                </div>
              </div>
            </div>

            <div className="text-wrap text-[14px] font-[500] text-cool-grayscale-700">
              정말 맛있어서 숨을 쉴 수 없습니다. 맙소사, 이와 같은 탁주는어디서
              오는 것입니까? 혹여 가보로 내려옵니까? 나의 공중제비를 멈추게
              하십시오!


            </div> */}
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 pt-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/food_search_icon.svg`}
                width={30}
                height={28}
                alt="icon"
              />
              <div className="flex flex-col items-center text-[14px] text-cool-grayscale-600">
                <span>잘 맞는 페어링 음식을 찾 있어요.</span>
                <span>조금만 기다려 주세요!</span>
              </div>
            </div>
          </article>
        </div>

        <button
          onClick={() => {
            router.push(`/share/liquor/${id}/filter`);
          }}
          className="my-4 h-[37px] w-full rounded-[4px] border-[1px] border-cool-grayscale-300 bg-white text-[14px] text-cool-grayscale-800"
        >
          모든 시음노트 보기
        </button>
      </div>
    </>
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
