"use client";

import clsx from "clsx";
import { parseNumberOfDefault } from "@/_utils/commons";
import React from "react";
import useVolumePriceStore from "@/_store/volumePriceStore";

interface Props {
  regularPrice: number;
}

export default function TraditionalLiquorDetailPrice({ regularPrice }: Props) {
  const { selectedVolumePriceDetails } = useVolumePriceStore((state) => {
    return {
      selectedVolumePriceDetails: state.selectedVolumePriceDetails,
    };
  });
  return (
    <div
      className={clsx(
        "text-start text-[16px] font-semibold text-cool-grayscale-700",
      )}
    >
      {parseNumberOfDefault({
        value: selectedVolumePriceDetails?.regularPrice || regularPrice,
      }).toLocaleString()}
      원
    </div>
  );
}
