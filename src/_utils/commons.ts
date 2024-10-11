import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sensoryValue: { [key: number]: { value: string; kind: string } } =
  {
    1: { value: "맑음", kind: "탁도" },
    2: { value: "맑은 편", kind: "탁도" },
    3: { value: "중간", kind: "탁도" },
    4: { value: "탁한 편", kind: "탁도" },
    5: { value: "탁함", kind: "탁도" },
    6: { value: "없음", kind: "탄산도" },
    7: { value: "적음", kind: "탄산도" },
    8: { value: "중간", kind: "탄산도" },
    9: { value: "있는 편", kind: "탄산도" },
    10: { value: "많음", kind: "탄산도" },
    11: { value: "없음", kind: "점성도" },
    12: { value: "적음", kind: "점성도" },
    13: { value: "중간", kind: "점성도" },
    14: { value: "있는 편", kind: "점성도" },
    15: { value: "많음", kind: "점성도" },
    16: { value: "맑음", kind: "투명도" },
    17: { value: "맑은 편", kind: "투명도" },
    18: { value: "중간", kind: "투명도" },
    19: { value: "흐린 편", kind: "투명도" },
    20: { value: "흐림", kind: "투명도" },
    21: { value: "없음", kind: "침전물" },
    22: { value: "있음", kind: "침전물" },
    23: { value: "연함", kind: "진하기" },
    24: { value: "연한 편", kind: "진하기" },
    25: { value: "중간", kind: "진하기" },
    26: { value: "진한 편", kind: "진하기" },
    27: { value: "진함", kind: "진하기" },
  };
export const flavorValue: {
  [key: number]: { description: string; score: number; flavor: string };
} = {
  1: { description: "매우 낮음", score: 1, flavor: "단맛" },
  2: { description: "낮음", score: 2, flavor: "단맛" },
  3: { description: "중간", score: 3, flavor: "단맛" },
  4: { description: "높음", score: 4, flavor: "단맛" },
  5: { description: "매우 높음", score: 5, flavor: "단맛" },
  6: { description: "매우 낮음", score: 1, flavor: "신맛" },
  7: { description: "낮음", score: 2, flavor: "신맛" },
  8: { description: "중간", score: 3, flavor: "신맛" },
  9: { description: "높음", score: 4, flavor: "신맛" },
  10: { description: "매우 높음", score: 5, flavor: "신맛" },
  11: { description: "매우 낮음", score: 1, flavor: "쓴맛" },
  12: { description: "낮음", score: 2, flavor: "쓴맛" },
  13: { description: "중간", score: 3, flavor: "쓴맛" },
  14: { description: "높음", score: 4, flavor: "쓴맛" },
  15: { description: "매우 높음", score: 5, flavor: "쓴맛" },
  16: { description: "매우 낮음", score: 1, flavor: "감칠맛" },
  17: { description: "낮음", score: 2, flavor: "감칠맛" },
  18: { description: "중간", score: 3, flavor: "감칠맛" },
  19: { description: "높음", score: 4, flavor: "감칠맛" },
  20: { description: "매우 높음", score: 5, flavor: "감칠맛" },
  21: { description: "매우 낮음", score: 1, flavor: "여운" },
  22: { description: "낮음", score: 2, flavor: "여운" },
  23: { description: "중간", score: 3, flavor: "여운" },
  24: { description: "높음", score: 4, flavor: "여운" },
  25: { description: "매우 높음", score: 5, flavor: "여운" },
  26: { description: "매우 낮음", score: 1, flavor: "무게감" },
  27: { description: "낮음", score: 2, flavor: "무게감" },
  28: { description: "중간", score: 3, flavor: "무게감" },
  29: { description: "높음", score: 4, flavor: "무게감" },
  30: { description: "매우 높음", score: 5, flavor: "무게감" },
};

export const sensoryMap = new Map<number, { value: string; kind: string }>(
  Object.entries(sensoryValue).map(([key, value]) => [Number(key), value]),
);

export const flavorMap = new Map<number, string>(
  Object.entries(flavorValue).map(([key, value]) => [
    Number(key),
    value.flavor,
  ]),
);

export const flavorScoreMap = new Map<number, { label: string; data: number }>(
  Object.entries(flavorValue).map(([key, value]) => [
    Number(key),
    {
      data: value.score,
      label: value.flavor,
    },
  ]),
);
