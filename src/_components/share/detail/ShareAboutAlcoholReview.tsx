"use client";

import { Fragment, ReactNode, useEffect } from "react";
import { sensoryMap } from "@/_utils/commons";

interface Props {
  sensoryLevelIds: number[] | undefined;
  alcoholColor: string;
}

export default function ShareAboutAlcoholReview({
  sensoryLevelIds,
  alcoholColor,
}: Props) {
  const sensoryValues: { value: string; kind: string }[] =
    sensoryLevelIds
      ?.map((id) => sensoryMap.get(id))
      .filter(
        (item): item is { value: string; kind: string } => item != undefined,
      ) || [];

  useEffect(() => {}, [alcoholColor]);
  return (
    <div className="grid w-full grid-cols-[5fr_1fr_5fr] grid-rows-2 items-center gap-y-3">
      {/* 첫행 */}
      <div className="flex items-center justify-between">
        <div>술색</div>
        <div
          className={`h-[28px] w-[56px] rounded-md border-[1px] border-secondary`}
          style={{ backgroundColor: alcoholColor }}
        ></div>
      </div>

      {sensoryValues.map(({ value, kind }, index) => {
        return (
          <Fragment key={"s-" + index}>
            {index % 2 === 0 && <Separator />}
            <div className="flex items-center justify-between">
              <div>{kind}</div>
              <OrangeText>
                {/* {sensoryFindMap.get("탁도") || "데이터 없음"} */}
                {value}
              </OrangeText>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

function Separator() {
  return <div className="mx-auto h-[8px] w-[1px] bg-cool-grayscale-300"></div>;
}
function OrangeText({ children }: { children: ReactNode }) {
  return (
    <div className="text-[16px] font-semibold text-primary-700">{children}</div>
  );
}
