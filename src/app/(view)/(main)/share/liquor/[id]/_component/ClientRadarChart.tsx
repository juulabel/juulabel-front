"use client";

import RadarChart from "@/_components/tasting-note/write/HexagonChart";
import { IFlavor } from "@/_types/share";

interface Props {
  flavor: IFlavor[];
}

export default function ClientRadarChart({ flavor }: Props) {
  return (
    <RadarChart
      dataPoints={
        flavor.map(({ name, score }) => ({
          data: score,
          label: name,
        })) || []
      }
    />
  );
}
