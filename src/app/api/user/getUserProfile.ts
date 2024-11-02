import axios from "axios";
import { instance } from "../axios";

export async function getUserProfile(id: number, token: string) {
  try {
    const response = await instance.get(`/v1/api/members/${id}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
