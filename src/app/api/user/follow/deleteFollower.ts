import { instance } from "@/app/api/axios";
import requests from "../../requests";

export async function deleteFollower(id: string) {
  const response = await instance.post(requests.deleteFollow, {
    followerId: id,
  });
  if (response.status === 200 && response.data) {
    return response.data;
  } else {
    throw new Error(
      `Unexpected response : ${response.status} ${response.statusText}`,
    );
  }
}
