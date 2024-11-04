import axios from "axios";
import { instance } from "../axios";

export async function getLifeDetail(accessToken: string, dailyLifeId: string) {
  const response = await instance.get(`/v1/api/daily-lives/${dailyLifeId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
