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

export const scentMap = new Map<number, string>([
    [1, "꽃"],
    [2, "허브"],
    [3, "풀/나무"],
    [4, "축"],
    [5, "스모크"],
    [6, "오크향"],
    [7, "사과"],
    [8, "귤/오렌지"],
    [9, "레몬/라임"],
    [10, "딸기"],
    [11, "복숭아"],
    [12, "체리"],
    [13, "메론"],
    [14, "망고"],
    [15, "참외"],
    [16, "수박"],
    [18, "블루베리"],
    [19, "파인애플"],
    [20, "오미자"],
    [21, "바질"],
    [22, "생강"],
    [23, "버섯"],
    [24, "포도"],
    [25, "브리"],
    [26, "밀"],
    [27, "생쌀"],
    [28, "옥수수"],
    [29, "갓 지은 밥"],
    [30, "엿기름"],
    [31, "황실료"],
    [32, "게피"],
    [33, "꿀"],
    [34, "팔각"],
    [35, "누룽향"],
    [36, "버터"],
    [37, "버닐라"],
    [38, "초콜릿"],
    [39, "후추"],
    [40, "종이향"],
    [41, "카라멜"],
    [42, "알코울 취"]
]);

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

export function mapImageUrl({
  url,
  defaultUrl = "https://picsum.photos/id/237/200/300",
}: {
  url: string | null | undefined;
  defaultUrl?: string;
}) {
  if (!url || !url.startsWith("https://")) {
    return defaultUrl;
  }

  return url;
}

export function parseNumberOfDefault({
  value,
  defaultValue = 0,
}: {
  value: number | undefined;
  defaultValue?: number;
}) {
  if (!value) return defaultValue;
  const parsedNumber = Number(value);
  if (!isNaN(parsedNumber)) {
    return parsedNumber;
  }
  return defaultValue;
}
