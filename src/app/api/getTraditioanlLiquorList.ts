import { DrinkApiResponse } from "@/_types/tasting-note/drink";

export const fetchLiquor = async (): Promise<DrinkApiResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/alcohols/alcoholic-drinks?size=20`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch drinks");
  }

  return res.json();
};
