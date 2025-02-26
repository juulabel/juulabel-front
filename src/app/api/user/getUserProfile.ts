import { instance } from "../axios";
import { Cookies } from "react-cookie";

export async function getUserProfile(id: string) {
  try {
    const cookies = new Cookies();

    const response = await instance.get(`/v1/api/members/${id}/profile`, {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    });
    if (response.status === 200 && response.data) return response.data.result;
  } catch (error) {
    console.error(error);
  }
}
