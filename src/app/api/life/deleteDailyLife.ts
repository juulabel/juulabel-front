import { instance } from "../axios";
import requests from "../requests";

export async function deleteDailyLife(
  accessToken: string,
  id: string,
): Promise<boolean> {
  try {
    const response = await instance.delete(`${requests.lifeDelete}${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200 && response.data) {
      return response.data.success;
    } else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return false;
  }
}
