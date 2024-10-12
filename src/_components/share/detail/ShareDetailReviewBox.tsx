"use client";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import HexagonChart from "../../tasting-note/HexagonChart";
import MoonRating from "./MoonRating";
import { ITastingNoteDetailInfo } from "@/_types";
import { flavorMap, flavorScoreMap, sensoryMap } from "@/_utils/commons";
import RadarChart from "../../tasting-note/HexagonChart";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
  sensoryLevelIds: number[] | undefined;
  flavorLevelIds: number[] | undefined;
}

export default function ShareDetailReviewBox({
  info,
  sensoryLevelIds,
  flavorLevelIds,
}: Props) {
  // id 값들을 실제 맛으로 변경
  const sensoryValues: { value: string; kind: string }[] =
    sensoryLevelIds
      ?.map((id) => sensoryMap.get(id))
      .filter(
        (item): item is { value: string; kind: string } => item !== undefined,
      ) || [];

  //find 돌리면서 하나씩 찾기 싫어서 Map 사용함
  const [sensoryFindMap, setSensoryFindMap] = useState<Map<string, string>>(
    new Map(sensoryValues.map(({ value, kind }) => [kind, value])),
  );

  const flavorChartData: { label: string; data: number }[] =
    flavorLevelIds
      ?.map((id) => flavorScoreMap.get(id))
      .filter(
        (item): item is { label: string; data: number } => item !== undefined,
      ) || [];

  // const flavorChartData = flavorLevelIds.map(({ flavorName, score }) => ({
  //   label: flavorName,
  //   data: score,
  // }));

  useEffect(() => {});
  if (!info) {
    return <div></div>;
  }
  return (
    <section className="flex w-full flex-col px-3 pt-4">
      {/* 술 느낀점 */}
      <div className="flex flex-col gap-4">
        <div className="h-[28px] text-[20px] font-bold leading-[27.6px] text-cool-grayscale-800">
          {info.memberInfo.nickname} 님은 이 술에 대해 이렇게 느꼈어요!
        </div>

        <div className="grid w-full grid-cols-[5fr_1fr_5fr] grid-rows-2 items-center gap-y-3">
          {/* 첫행 */}
          <div className="flex items-center justify-between">
            <div>술색</div>
            <div
              className={`h-[28px] w-[56px] rounded-md border-[1px] border-secondary bg-[${info.rgbColor}]`}
            ></div>
          </div>
          {/* <Separator /> */}

          {sensoryValues.map(({ value, kind }, index) => {
            return (
              <>
                {index % 2 === 0 && <Separator />}
                <div className="flex items-center justify-between" key={index}>
                  <div>{kind}</div>
                  <OrangeText>
                    {/* {sensoryFindMap.get("탁도") || "데이터 없음"} */}
                    {value}
                  </OrangeText>
                </div>
              </>
            );
          })}

          {/* 두번쨰행 */}

          {/* <div className="flex items-center justify-between">
            <div>탄산</div>
            <OrangeText>
              {sensoryFindMap.get("탄산") || "데이터 없음"}
            </OrangeText>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>점성도</div>
            <OrangeText>
              {sensoryFindMap.get("점성도") || "데이터 없음"}
            </OrangeText>
          </div> */}
        </div>
      </div>

      <Gap />

      {/* 술향 */}
      <div className="space-y-1">
        <div className="text-[16px] font-semibold text-cool-grayscale-600">
          술 향
        </div>

        <div className="flex w-fit flex-shrink-0 items-center gap-2">
          {flavorLevelIds?.map((id, index) => {
            return (
              <Fragment key={index + "key"}>
                <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
                  {flavorMap.get(id)}
                </span>
                {flavorLevelIds.length - 1 !== index && <Separator />}
              </Fragment>
            );
          })}
        </div>
      </div>

      <Gap />
      {/* 술맛 그래프 */}
      <div>
        <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
          술 맛 그래프
        </span>

        <div className="mt-4 flex w-full justify-center">
          <RadarChart dataPoints={flavorChartData} />
        </div>
      </div>
      {/* 부연설명 */}
      <div className="space-y-2">
        <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
          부연설명
        </span>

        <div className="h-[79px] w-full overflow-auto rounded-lg border-[1px] border-cool-grayscale-200 p-2 text-[14px] font-normal text-cool-grayscale-700">
          {info.content}
        </div>
      </div>

      <div className="mb-10 mt-3 flex flex-row justify-between px-1">
        {/* 평점 */}
        <div className="flex flex-row items-center">
          <span className="mr-3 text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
            달점
          </span>
          <span className="mr-2 pb-1 text-[24px] font-bold text-primary-700">
            {info.rating}
          </span>
          <span className="text-cool-grayscale-400">/5 점</span>
        </div>

        {/* 달점 */}
        <MoonRating rating={info.rating} />
      </div>
    </section>
  );
}

function OrangeText({ children }: { children: ReactNode }) {
  return (
    <div className="text-[16px] font-semibold text-primary-700">{children}</div>
  );
}

function Gap() {
  return <div className="my-6 h-[1px] w-full bg-cool-grayscale-100"></div>;
}

function Separator() {
  return <div className="mx-auto h-[8px] w-[1px] bg-cool-grayscale-300"></div>;
}

function ReviewMoon() {}
