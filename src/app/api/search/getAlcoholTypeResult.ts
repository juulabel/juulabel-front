import { IAlcoholTypeData } from "@/_types/search/alcoholTypeData";
import { instance } from "../axios";
import requests from "../requests";
import { IAlcoholTypeResult } from "@/_types/search/alcoholTypeResult";

export async function getAlcoholTypeResult(
  accessToken: string,
  type: number,
  sortType: string,
): Promise<IAlcoholTypeResult | null> {
  try {
    const params = {
      type: type.toString(),
      sortType: sortType,
      pageSize: "15", // Convert the number to a string
    };

    // Create a query string from the params object
    const queryString = new URLSearchParams(params).toString();

    const response = await instance.get(
      `${requests.typeSerach}${queryString}`,
      // {
      //   withCredentials: true,
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // },
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
