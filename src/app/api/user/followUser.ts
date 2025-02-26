import { instance } from "@/app/api/axios";
import requests from "../requests";

export async function followUser(id: string) {
  try {
    const response = await instance.post(requests.follow, { followeeId: id });
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
}
