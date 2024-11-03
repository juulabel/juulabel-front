import { instance } from "../axios";

export default async function getMyInfo(token: string) {
  try {
    const response = await instance.get(`/v1/api/members/my-info`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.result;
  } catch (error) {
    console.log(error);
  }
}
