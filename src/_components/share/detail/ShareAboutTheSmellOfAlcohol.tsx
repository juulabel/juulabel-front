import { Fragment } from "react";
import { flavorMap } from "@/_utils/commons";
import Separator from "../Separator";

interface Props {
  flavorLevelIds: number[];
}

export default function ShareAboutTheSmellOfAlcohol({ flavorLevelIds }: Props) {
  return (
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
              {flavorLevelIds.length - 1 !== index && (
                <Separator className="mx-auto" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
