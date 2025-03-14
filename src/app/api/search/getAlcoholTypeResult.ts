import { instance } from "../axios";
import requests from "../requests";

export async function getAlcoholTypeResult(
  type: number,
  sortType: string,
  lastAlcoholicDrinksName?: string | null,
) {
  const params = {
    type: type.toString(),
    sortType: sortType,
    pageSize: "15",
    lastAlcoholicDrinksName: lastAlcoholicDrinksName ?? "",
  };

  const queryString = new URLSearchParams(params).toString();

  const response = await instance.get(`${requests.typeSerach}${queryString}`);

  return {
    data: response.data.result.alcoholicDrinks.content,
    totalCount: response.data.result.totalCount,
    isLast: response.data.result.isLast,
  };
}
