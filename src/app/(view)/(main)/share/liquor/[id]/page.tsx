import MoonRating from "@/_components/share/detail/MoonRating";
import ShareAboutAlcoholReview from "@/_components/share/detail/ShareAboutAlcoholReview";
import ShareAboutTheSmellOfAlcohol from "@/_components/share/detail/ShareAboutTheSmellOfAlcohol";
import ShareTraditionalLiquor from "@/_components/share/detail/ShareTraditionalLiquor";
import ServerToast from "@/_components/share/error/ServerToast";
import Separator from "@/_components/share/Separator";
import RadarChart from "@/_components/tasting-note/write/HexagonChart";
import { SearchParamProps } from "@/_types";
import { DrinkApiResponse } from "@/_types/tasting-note/drink";
import { fetchLiquor } from "@/app/api/getTraditioanlLiquorList";
import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";

// export async function generateStaticParams() {
//   const { result } = await fetchLiquor();
//   return result.alcoholicDrinks.map((drink) => ({
//     id: drink.id.toString(),
//   }));
// }

export default function LiquorDetailPage({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);

  if (!numberTypeId || isNaN(numberTypeId)) {
    return <ServerToast text="잘못된 접근입니다." redirectPath="/share/note" />;
  }

  return (
    <section className="relative h-screen w-full max-w-[560px] overflow-y-auto overflow-x-hidden">
      <ShareTraditionalLiquor id={numberTypeId} />
    </section>
  );
}
