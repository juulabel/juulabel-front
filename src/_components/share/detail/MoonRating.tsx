"use client";

import Image from "next/image";

type MoonType = "full" | "half" | "empty";

/**
 * @param rating 1.0 ~ 5.0
 */
export default function MoonRating({ rating }: { rating: number }) {
  const moons: string[] = [];

  // 꽉 찬 달
  const fullMoons = Math.floor(rating);
  // 반달 필요한지 체크함
  const hasHalfMoon = rating % 1 !== 0;
  // 빈달
  const remainingMoons = 5 - Math.ceil(rating);

  return (
    <div className="flex flex-row gap-2">
      {renderMoon({
        length: fullMoons,
        type: "full",
      })}
      {renderMoon({
        length: Number(hasHalfMoon),
        type: "half",
      })}
      {renderMoon({
        length: remainingMoons,
        type: "empty",
      })}
    </div>
  );
}

function renderMoon({ length, type }: { length: number; type: MoonType }) {
  const moonTypeToSrc: { [key in MoonType]: string } = {
    full: "/svg/moon/full-moon.svg",
    half: "/svg/moon/half-moon.svg",
    empty: "/svg/moon/empty-moon.svg",
  };

  return Array.from({ length }, (_, index) => (
    <Image
      key={index}
      src={moonTypeToSrc[type]}
      alt={`${index}`}
      width={30}
      height={30}
    />
  ));
}
