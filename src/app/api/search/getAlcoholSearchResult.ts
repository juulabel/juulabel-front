import { IAlcoholSearchData } from "@/_types/search/alcoholSearchData";
import { instance } from "../axios";
import requests from "../requests";
import { IAlcoholSearchResult } from "@/_types/search/alcoholSearchResult";

export async function getAlcoholSearchResult(
  accessToken: string,
  search: string,
): Promise<IAlcoholSearchResult | null> {
  try {
    const params = {
      search: search,
      pageSize: "15",
    };

    // Create a query string from the params object
    const queryString = new URLSearchParams(params).toString();

    const response = await instance.get(
      `${requests.noteSearch}${queryString}`,
      //   {
      //     withCredentials: true,
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   },
    );
    if (response.status === 200 && response.data) {
      return response.data.result;
    } else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return null;
  }
}
