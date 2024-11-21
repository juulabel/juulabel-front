import Image from "next/image";

type MoonType = "full" | "half" | "quarter" | "threeQuarter" | "empty";

type Params = {
  count: number;
  moonType: MoonType;
};

/**
 * @note full 1.0
 * @note threeQuarter 0.75
 * @note half 0.5
 * @note quarter 0.25
 */

/**
 * @param rating 1.0 ~ 5.0 in 0.25 단위로 받도록했음 (e.g., 0.25, 0.5, 0.75, 1.0, etc.)
 */

export default function MoonRating({ rating }: { rating: number }) {
  const fullMoonCount = Math.floor(rating);
  const remainder = rating - fullMoonCount;

  const hasThreeQuarterMoon = remainder >= 0.75;
  const hasHalfMoon = !hasThreeQuarterMoon && remainder >= 0.5;
  const hasQuarterMoon =
    !hasThreeQuarterMoon && !hasHalfMoon && remainder >= 0.25;

  const emptyMoonCount =
    5 -
    fullMoonCount -
    Number(hasThreeQuarterMoon) -
    Number(hasHalfMoon) -
    Number(hasQuarterMoon);

  return (
    <div className="flex flex-row gap-2">
      {renderMoons({
        count: fullMoonCount,
        moonType: "full",
      })}
      {renderMoons({
        count: Number(hasThreeQuarterMoon),
        moonType: "threeQuarter",
      })}
      {renderMoons({
        count: Number(hasHalfMoon),
        moonType: "half",
      })}
      {renderMoons({
        count: Number(hasQuarterMoon),
        moonType: "quarter",
      })}
      {renderMoons({
        count: emptyMoonCount,
        moonType: "empty",
      })}
    </div>
  );
}

function renderMoons({ count, moonType }: Params) {
  const moonImages: Record<MoonType, string> = {
    full: "/svg/moonpoint_full.svg",
    threeQuarter: "/svg/moonpoint_quarter2.svg", // TODO 이미지 찾기
    half: "/svg/moonpoint_half.svg",
    quarter: "/svg/moonpoint_quarter1.svg", //TODO 임지ㅣㅊ자기
    empty: "/svg/moonpoint_default.svg",
  };

  return Array.from({ length: count }, (_, index) => {
    return (
      <Image
        key={`${moonType}-${index}`}
        src={moonImages[moonType]}
        alt={`${moonType} moon`}
        width={30}
        height={30}
      />
    );
  });
}
