import { instance } from "../axios";
import requests from "../requests";

export async function getAlcoholSearchResult(
  search: string,
  lastAlcoholicDrinksName: string | null,
) {
  const params: Record<string, string> = {
    search: search,
    pageSize: "15",
    ...(lastAlcoholicDrinksName && {
      lastAlcoholicDrinksName: lastAlcoholicDrinksName,
    }),
  };

  // Create a query string from the params object
  const queryString = new URLSearchParams(params).toString();

  const response = await instance.get(`${requests.noteSearch}${queryString}`);

  return {
    data: response.data.result.alcoholicDrinks,
    totalCount: response.data.result.totalCount,
    isLast: response.data.result.isLast,
  };
}
