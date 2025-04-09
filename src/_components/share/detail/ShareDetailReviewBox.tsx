"use client";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import HexagonChart from "../../tasting-note/write/HexagonChart";
import MoonRating from "./MoonRating";
import { ITastingNoteDetailInfo } from "@/_types";
import {
  flavorMap,
  flavorScoreMap,
  scentMap,
  sensoryMap,
} from "@/_utils/commons";
import RadarChart from "../../tasting-note/write/HexagonChart";
import ShareAboutAlcoholReview from "./ShareAboutAlcoholReview";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
  sensoryLevelIds: number[] | undefined;
  flavorLevelIds: number[] | undefined;
  scentIds: number[] | undefined;
}

export default function ShareDetailReviewBox({
  info,
  sensoryLevelIds,
  flavorLevelIds,
  scentIds,
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

  useEffect(() => {});
  if (!info) {
    return <div></div>;
  }
  return (
    <section className="flex w-full flex-col px-3 pt-4">
      {/* 술 느낀점 */}
      <div className="flex flex-col gap-4">
        <div className="mb-2 h-[28px] text-[18px] font-bold leading-[27.6px] text-cool-grayscale-800">
          {info.memberInfo.nickname} 님은 이 술에 대해 이렇게 느꼈어요!
        </div>

        <ShareAboutAlcoholReview
          sensoryLevelIds={sensoryLevelIds}
          alcoholColor={info.rgbColor}
        />
      </div>

      <Gap />

      {/* 술향 */}
      <div className="space-y-1">
        <div className="text-[16px] font-semibold text-cool-grayscale-600">
          술 향
        </div>

        <div className="flex w-fit flex-shrink-0 items-center gap-2">
          {scentIds?.map((id, index) => {
            return (
              <Fragment key={index + "key"}>
                <span className="text-[16px] font-bold leading-[24px] text-cool-grayscale-700">
                  {scentMap.get(id)}
                </span>
                {scentIds?.length - 1 !== index && <Separator />}
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

        <div
          className="h-[79px] w-full overflow-auto rounded-lg border-[1px] border-cool-grayscale-200 p-2 text-[14px] font-normal text-cool-grayscale-700"
          style={{ whiteSpace: "pre-wrap" }}
        >
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
