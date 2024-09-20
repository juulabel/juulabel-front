import { instance } from "@/app/api/axios";
import requests from "../../requests";

export const getAlcoholTypes = async () => {
  try {
    const response = await instance.get(requests.getAlcoholTypes);
    if (response.data) {
      return response.data.result;
    } else {
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
};
