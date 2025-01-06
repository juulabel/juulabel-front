"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import TraditionalLiquorDropDown from "@/_components/share/detail/TraditionalLiquorDropDown";
import useVolumePriceStore from "@/_store/volumePriceStore";

interface Props {
  alcoholicVolume: string;
  mediumTextStyle: string;
}

export default function TraditionalLiquorCapacityCell({
  alcoholicVolume,
  mediumTextStyle,
}: Props) {
  const [clicked, setClicked] = useState<boolean>(false);
  const { selectedVolumePriceDetails } = useVolumePriceStore((state) => {
    return {
      selectedVolumePriceDetails: state.selectedVolumePriceDetails,
    };
  });
  const toggle = () => {
    setClicked((prev) => !prev);
  };

  useEffect(() => {}, []);

  return (
    <div
      className={clsx(
        "text-star2 relative flex flex-row gap-1",
        mediumTextStyle,
      )}
    >
      {selectedVolumePriceDetails?.volume || alcoholicVolume}ml
      <TraditionalLiquorDropDown selectedCallback={toggle}>
        <Image
          src={"/svg/down_arrow.svg"}
          alt={"v"}
          className={clsx("cursor-pointer transition-transform duration-300", {
            "rotate-180": clicked,
          })}
          width={24}
          height={24}
          onClick={toggle}
        />
      </TraditionalLiquorDropDown>
    </div>
  );
}
