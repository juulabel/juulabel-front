import { instance } from "../axios";
import requests from "../requests";

export async function getAlcoholType() {
  try {
    const response = await instance.get(requests.getAlcoholTypes);
    if (response.status === 200 && response.data) return response.data.result;
    else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return null;
  }
}
